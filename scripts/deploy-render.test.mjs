import test from 'node:test';
import assert from 'node:assert/strict';
import { cli } from './deploy-render.mjs';

const sha = 'a'.repeat(40);
const env = { GITHUB_SHA: sha, RENDER_API_KEY: 'secret',
  RENDER_SERVICE_ID: 'srv-example', RENDER_SITE_URL: 'https://facea.onrender.com' };
const deploy = (status, commit = sha, id = 'dep-example') => ({ id, status, commit: { id: commit } });
function harness(responses) {
  const calls = [], out = [], err = [], waits = [];
  return { calls, out, err, waits, deps: {
    fetch: async (url, options) => {
      calls.push({ url, ...options });
      const response = responses.shift();
      assert.ok(response, 'unexpected request');
      if (response instanceof Error) throw response;
      if (response instanceof Response) return response;
      return new Response(JSON.stringify(response.body ?? {}), { status: response.status ?? 200 });
    }, delay: async ms => waits.push(ms), maxPolls: 2,
    stdout: text => out.push(text), stderr: text => err.push(text),
  } };
}

test('deploy sends exact checked commit and waits for live before both smoke routes', async () => {
  const h = harness([{ body: deploy('build_in_progress') }, { body: deploy('update_in_progress') },
    { body: deploy('live') }, {}, {}]);
  assert.equal(await cli(env, h.deps), 0);
  assert.deepEqual(h.err, []);
  assert.deepEqual(h.out, ['Render deploy dep-example is live; HTTP smoke passed for / and /login.']);
  assert.deepEqual(JSON.parse(h.calls[0].body), { commitId: sha });
  assert.equal(h.calls[0].url, 'https://api.render.com/v1/services/srv-example/deploys');
  assert.deepEqual(h.calls.slice(1, 3).map(c => c.url), Array(2).fill(
    'https://api.render.com/v1/services/srv-example/deploys/dep-example'));
  assert.deepEqual(h.calls.slice(3).map(c => c.url), [env.RENDER_SITE_URL + '/', env.RENDER_SITE_URL + '/login']);
  assert.ok(h.calls.slice(0, 3).every(c => c.headers.Authorization === 'Bearer secret'));
  assert.ok(h.calls.slice(3).every(c => !c.headers?.Authorization));
  assert.ok(h.calls.every(c => c.signal instanceof AbortSignal && c.redirect === 'error'));
  assert.equal(h.waits.length, 2);
});

test('invalid configuration rejects without any request', async () => {
  for (const override of [{ GITHUB_SHA: 'main' }, { RENDER_API_KEY: '' },
    { RENDER_SERVICE_ID: '../other' }, { RENDER_SITE_URL: 'http://example.com' },
    { RENDER_SITE_URL: 'https://user:secret@example.com' }]) {
    const h = harness([]);
    assert.equal(await cli({ ...env, ...override }, h.deps), 1);
    assert.equal(h.calls.length, 0);
    assert.deepEqual(h.out, []);
    assert.deepEqual(h.err, [override.GITHUB_SHA ? 'A full checked SHA is required.' :
      Object.hasOwn(override, 'RENDER_SITE_URL') ?
        'RENDER_SITE_URL must be a public HTTPS origin without credentials.' :
        'Render API key and service ID are required.']);
  }
});

test('mismatched commit at creation or poll and invalid deploy id fail closed', async () => {
  for (const responses of [
    [{ body: deploy('live', 'b'.repeat(40)) }],
    [{ body: deploy('build_in_progress') }, { body: deploy('live', 'b'.repeat(40)) }],
    [{ body: deploy('live', sha, '../other') }],
    [{ body: deploy('build_in_progress') }, { body: deploy('live', sha, 'dep-other') }],
  ]) {
    const h = harness(responses);
    assert.equal(await cli(env, h.deps), 1);
    assert.ok(h.calls.length <= 2);
    assert.deepEqual(h.out, []);
    assert.deepEqual(h.err, ['Render deploy identity mismatch.']);
  }
});

test('terminal failure states never smoke', async () => {
  for (const status of ['build_failed', 'update_failed', 'pre_deploy_failed', 'canceled', 'deactivated']) {
    const h = harness([{ body: deploy(status) }]);
    assert.equal(await cli(env, h.deps), 1);
    assert.equal(h.calls.length, 1);
    assert.deepEqual(h.out, []);
    assert.deepEqual(h.err, ['Render deploy failed: ' + status + '.']);
  }
});

test('bounded polling times out without success or smoke', async () => {
  const h = harness(Array.from({ length: 3 }, () => ({ body: deploy('build_in_progress') })));
  assert.equal(await cli(env, h.deps), 1);
  assert.equal(h.calls.length, 3);
  assert.deepEqual(h.out, []);
  assert.deepEqual(h.err, ['Render deploy timed out.']);
});

test('HTTP, network/timeout, malformed responses and smoke failures are sanitized', async () => {
  for (const [responses, expected] of [
    [[{ status: 401, body: { message: 'secret' } }], 'Render request failed (HTTP 401).'],
    [[new Error('secret request body')], 'Render request failed or timed out.'],
    [[new Response('not JSON')], 'Render response was invalid JSON.'],
    [[{ body: {} }], 'Render deploy identity mismatch.'],
    [[{ body: deploy('live') }, { status: 503 }], 'Smoke request failed (HTTP 503).'],
    [[{ body: deploy('live') }, {}, { status: 404 }], 'Smoke request failed (HTTP 404).'],
    [[{ body: deploy('live') }, { status: 302 }], 'Smoke request failed (HTTP 302).'],
    [[{ body: deploy('live') }, new Error('secret smoke timeout')], 'Smoke request failed or timed out.'],
  ]) {
    const h = harness(responses);
    assert.equal(await cli(env, h.deps), 1);
    assert.deepEqual(h.out, []);
    assert.deepEqual(h.err, [expected]);
    assert.doesNotMatch(h.err[0], /secret/);
  }
});
