// Shared bounded transport: never expose response bodies, URLs or fetch errors.
export async function request(url, options, { fetch: fetcher = globalThis.fetch } = {},
  { label = 'GitHub', allow404 = false, json = true } = {}) {
  let response;
  try {
    response = await fetcher(url, { ...options, redirect: 'error', signal: AbortSignal.timeout(10_000) });
  } catch {
    throw new Error(`${label} request failed or timed out.`);
  }
  if (allow404 && response.status === 404) return { status: 404 };
  if (!response.ok) throw new Error(`${label} request failed (HTTP ${response.status}).`);
  if (!json) return { status: response.status };
  try {
    return { status: response.status, body: await response.json() };
  } catch {
    throw new Error(`${label} response was invalid JSON.`);
  }
}

export async function cli(mode, env = process.env, deps = {}) {
  const stdout = deps.stdout ?? console.log;
  const stderr = deps.stderr ?? console.error;
  try {
    if (!['preflight', 'publish'].includes(mode)) throw new Error('Use release.mjs preflight|publish.');
    if (env.GITHUB_REF !== 'refs/heads/main') throw new Error('Release requires main.');
    if (!/^[0-9a-f]{40}$/.test(env.GITHUB_SHA ?? '')) throw new Error('A full checked SHA is required.');
    if (!/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(env.RELEASE_VERSION ?? '')) {
      throw new Error('Version must be MAJOR.MINOR.PATCH without a v prefix or leading zeros.');
    }
    if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(env.GITHUB_REPOSITORY ?? '') || !env.GH_TOKEN) {
      throw new Error('GitHub repository and token are required.');
    }
    const tag = `v${env.RELEASE_VERSION}`;
    const base = `https://api.github.com/repos/${env.GITHUB_REPOSITORY}`;
    const headers = { Authorization: `Bearer ${env.GH_TOKEN}`, Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28', 'Content-Type': 'application/json' };
    const existing = await request(`${base}/git/ref/tags/${tag}`, { method: 'GET', headers }, deps, { allow404: true });
    if (existing.status !== 404) throw new Error(`Tag ${tag} already exists.`);
    if (mode === 'preflight') {
      stdout(`Preflight passed for ${tag}.`);
      return 0;
    }
    // Repeat collision validation after checks; a concurrent tag creator cannot overwrite an existing ref.
    await request(`${base}/git/refs`, { method: 'POST', headers,
      body: JSON.stringify({ ref: `refs/tags/${tag}`, sha: env.GITHUB_SHA }) }, deps);
    await request(`${base}/releases`, { method: 'POST', headers, body: JSON.stringify({
      tag_name: tag, target_commitish: env.GITHUB_SHA, name: tag, draft: false, prerelease: false,
    }) }, deps);
    stdout(`Published ${tag} at ${env.GITHUB_SHA}.`);
    return 0;
  } catch (error) {
    stderr(error.message);
    return 1;
  }
}

if (import.meta.main) process.exitCode = await cli(process.argv[2]);
