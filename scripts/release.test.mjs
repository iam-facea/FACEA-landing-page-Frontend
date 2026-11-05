import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { cli } from './release.mjs';

const sha = 'a'.repeat(40);
const env = { GITHUB_REF: 'refs/heads/main', GITHUB_SHA: sha,
  GITHUB_REPOSITORY: 'owner/repo', GH_TOKEN: 'secret', RELEASE_VERSION: '1.0.0' };
function harness(responses) {
  const calls = [], out = [], err = [];
  return { calls, out, err, deps: {
    fetch: async (url, options) => {
      calls.push({ url, ...options });
      const response = responses.shift();
      assert.ok(response, 'unexpected request');
      return new Response(JSON.stringify(response.body ?? {}), { status: response.status });
    }, stdout: text => out.push(text), stderr: text => err.push(text),
  } };
}

test('invalid version, branch, or SHA fails before requests', async () => {
  for (const override of [
    { RELEASE_VERSION: 'v1.0.0' }, { RELEASE_VERSION: '01.0.0' },
    { RELEASE_VERSION: '1.0.0;echo bad' }, { RELEASE_VERSION: '1.0' },
    { RELEASE_VERSION: '1.0.0\n' }, { GITHUB_SHA: sha + '\n' },
    { GITHUB_REF: 'refs/heads/develop' }, { GITHUB_SHA: 'main' },
  ]) {
    const h = harness([]);
    assert.equal(await cli('preflight', { ...env, ...override }, h.deps), 1);
    assert.equal(h.calls.length, 0);
    assert.deepEqual(h.out, []);
    assert.deepEqual(h.err, [override.GITHUB_REF ? 'Release requires main.' :
      override.GITHUB_SHA ? 'A full checked SHA is required.' :
      'Version must be MAJOR.MINOR.PATCH without a v prefix or leading zeros.']);
  }
});

test('collision prevents tag and release mutation in both modes', async () => {
  for (const mode of ['preflight', 'publish']) {
    const h = harness([{ status: 200 }]);
    assert.equal(await cli(mode, env, h.deps), 1);
    assert.deepEqual(h.calls.map(c => c.method), ['GET']);
    assert.deepEqual(h.out, []);
    assert.deepEqual(h.err, ['Tag v1.0.0 already exists.']);
  }
});

test('preflight only reads; publication pins tag and release to checked SHA', async () => {
  const pre = harness([{ status: 404 }]);
  assert.equal(await cli('preflight', env, pre.deps), 0);
  assert.deepEqual(pre.out, ['Preflight passed for v1.0.0.']);
  assert.deepEqual(pre.err, []);
  assert.deepEqual(pre.calls.map(c => c.method), ['GET']);
  const h = harness([{ status: 404 }, { status: 201 }, { status: 201 }]);
  assert.equal(await cli('publish', env, h.deps), 0);
  assert.deepEqual(h.err, []);
  assert.deepEqual(h.out, ['Published v1.0.0 at ' + sha + '.']);
  assert.deepEqual(JSON.parse(h.calls[1].body), { ref: 'refs/tags/v1.0.0', sha });
  assert.deepEqual(JSON.parse(h.calls[2].body), {
    tag_name: 'v1.0.0', target_commitish: sha, name: 'v1.0.0', draft: false, prerelease: false,
  });
  assert.ok(h.calls.every(c => c.url.startsWith('https://api.github.com/repos/owner/repo/')));
  assert.ok(h.calls.every(c => c.signal instanceof AbortSignal && c.redirect === 'error'));
});

test('API errors are sanitized and stop subsequent mutations', async () => {
  for (const responses of [[{ status: 403, body: { message: 'secret' } }],
    [{ status: 404 }, { status: 422, body: { message: 'secret' } }]]) {
    const h = harness(responses);
    assert.equal(await cli('publish', env, h.deps), 1);
    assert.deepEqual(h.out, []);
    assert.match(h.err[0], /^GitHub request failed \(HTTP (403|422)\)\.$/);
    assert.ok(h.calls.length <= 2);
  }
});

test('workflow gates publishing and deploy on checks and pins commit', () => {
  const source = readFileSync(new URL('../.github/workflows/release.yml', import.meta.url), 'utf8');
  assert.match(source, /workflow_dispatch:/);
  assert.match(source, /needs: preflight/);
  assert.match(source, /needs: checks/);
  assert.match(source, /needs: publish/);
  assert.match(source, /ref: \$\{\{ github.sha \}\}/);
  assert.match(source, /SONAR_TOKEN: \$\{\{ secrets.SONAR_TOKEN \}\}/);
  assert.doesNotMatch(source, /pull_request_target|secrets: inherit|cancel-in-progress: true/);
});
