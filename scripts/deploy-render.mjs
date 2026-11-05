import { setTimeout as delay } from 'node:timers/promises';
import { request } from './release.mjs';

const failed = new Set(['build_failed', 'update_failed', 'pre_deploy_failed', 'canceled', 'deactivated']);
const pending = new Set(['created', 'queued', 'build_in_progress', 'pre_deploy_in_progress', 'update_in_progress']);

export async function cli(env = process.env, deps = {}) {
  const stdout = deps.stdout ?? console.log;
  const stderr = deps.stderr ?? console.error;
  try {
    if (!/^[0-9a-f]{40}$/.test(env.GITHUB_SHA ?? '')) throw new Error('A full checked SHA is required.');
    if (!env.RENDER_API_KEY || !/^srv-[A-Za-z0-9]+$/.test(env.RENDER_SERVICE_ID ?? '')) {
      throw new Error('Render API key and service ID are required.');
    }
    let site;
    try { site = new URL(env.RENDER_SITE_URL); } catch { /* fail closed below */ }
    if (!site || site.protocol !== 'https:' || site.username || site.password ||
      site.pathname !== '/' || site.search || site.hash) {
      throw new Error('RENDER_SITE_URL must be a public HTTPS origin without credentials.');
    }
    const base = `https://api.render.com/v1/services/${env.RENDER_SERVICE_ID}/deploys`;
    const headers = { Authorization: `Bearer ${env.RENDER_API_KEY}`, 'Content-Type': 'application/json' };
    const render = async (url, options) => (await request(url, options, deps, { label: 'Render' })).body;
    let deployment = await render(base, { method: 'POST', headers,
      body: JSON.stringify({ commitId: env.GITHUB_SHA }) });
    const id = deployment?.id;
    // Poll only this service's validated deploy resource, never a URL returned by the API.
    const inspect = () => {
      if (!/^dep-[A-Za-z0-9]+$/.test(id ?? '') || deployment?.id !== id ||
        deployment?.commit?.id !== env.GITHUB_SHA) throw new Error('Render deploy identity mismatch.');
      if (failed.has(deployment.status)) throw new Error(`Render deploy failed: ${deployment.status}.`);
      if (deployment.status !== 'live' && !pending.has(deployment.status)) {
        throw new Error('Render returned an unknown deploy status.');
      }
    };
    inspect();
    const maxPolls = Math.min(deps.maxPolls ?? 60, 60);
    for (let attempt = 0; deployment.status !== 'live' && attempt < maxPolls; attempt++) {
      await (deps.delay ?? delay)(5_000);
      deployment = await render(`${base}/${id}`, { method: 'GET', headers });
      inspect();
    }
    if (deployment.status !== 'live') throw new Error('Render deploy timed out.');
    // No authorization header is sent to the public site. Redirects fail instead of masking bad routing.
    for (const path of ['/', '/login']) {
      await request(`${site.origin}${path}`, { method: 'GET' }, deps, { label: 'Smoke', json: false });
    }
    stdout(`Render deploy ${id} is live; HTTP smoke passed for / and /login.`);
    return 0;
  } catch (error) {
    stderr(error.message);
    return 1;
  }
}

if (import.meta.main) process.exitCode = await cli();
