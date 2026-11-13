import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import { createRequire } from 'node:module';
import test from 'node:test';

const require = createRequire(resolve('frontend/package.json'));
const { load } = require('js-yaml');
const workflow = load(readFileSync('.github/workflows/ci-cd.yml', 'utf8'));
const checks = workflow.jobs.checks;
const release = workflow.jobs['release-deploy'];
const versionStep = release.steps.find(step => step.name === 'Calcular próxima versión PATCH');

const git = (cwd, ...args) => execFileSync('git', args, { cwd, encoding: 'utf8' });

test('PR validates only; push main checks precede serialized publication', () => {
  assert.deepEqual(workflow.on, {
    pull_request: { branches: ['main'] }, push: { branches: ['main'] },
  });
  assert.equal(checks.if, undefined);
  assert.deepEqual(workflow.permissions, { contents: 'read' });
  assert.equal(checks.permissions, undefined);
  assert.deepEqual(release.permissions, { contents: 'write' });
  assert.equal(release.needs, 'checks');
  assert.equal(release.if, "github.event_name == 'push' && github.ref == 'refs/heads/main'");
  assert.deepEqual(release.concurrency, { group: 'production-release', 'cancel-in-progress': false });
  assert.equal(release.environment, 'production');
  assert.ok(!JSON.stringify(workflow).includes('inputs.version'));
  for (const job of [checks, release]) {
    const checkout = job.steps.find(step => step.uses === 'actions/checkout@v4');
    assert.equal(checkout.with.ref, '${{ github.sha }}');
    assert.equal(checkout.with['fetch-depth'], 0);
    assert.equal(checkout.with['persist-credentials'], false);
  }
  const setup = release.steps.findIndex(step => step.uses === 'actions/setup-node@v4');
  const calculate = release.steps.indexOf(versionStep);
  assert.ok(setup >= 0 && setup < calculate);
  assert.equal(release.steps[setup].with['node-version-file'], '.nvmrc');
  assert.ok(release.steps.some((step, index) => index < calculate && /git fetch --tags origin/.test(step.run ?? '')));
  assert.ok(calculate < release.steps.findIndex(step => step.run?.includes('gh release create')));
});

test('existing checks, collision validation and exact-SHA release/Render remain', () => {
  const scripts = checks.steps.map(step => step.run ?? '').join('\n');
  for (const command of ['npm ci', 'npm run lint', 'npm run test:coverage', 'npm run build',
    'npm run test:e2e -- --retries=0 --reporter=list', 'npm run sonar --prefix frontend']) {
    assert.ok(scripts.includes(command), command);
  }
  assert.ok(scripts.includes('-Dsonar.scm.revision="$GITHUB_SHA"'));
  const sonar = checks.steps.find(step => step.name === 'SonarQube Cloud y Quality Gate');
  assert.ok(sonar.env.SONAR_TOKEN.includes('github.event.pull_request.head.repo.fork != true'));
  assert.ok(scripts.includes('Falta configuración Sonar (forks sin token).'));
  assert.equal(checks.steps.find(step => step.uses === 'actions/upload-artifact@v4').if, 'always()');
  const publish = release.steps.find(step => step.run?.includes('gh release create')).run;
  assert.ok(publish.includes('Versión inválida.'));
  assert.ok(publish.includes('git/matching-refs/tags/v$VERSION'));
  assert.ok(publish.includes("'all(.[]; .ref != $tag)'"));
  assert.ok(publish.includes('-f "ref=refs/tags/v$VERSION" -f "sha=$GITHUB_SHA"'));
  assert.ok(publish.includes('--verify-tag'));
  const deploy = release.steps.find(step => step.run?.includes('api.render.com')).run;
  assert.ok(deploy.includes("--arg sha \"$GITHUB_SHA\" '{commitId: $sha}'"));
  assert.ok(deploy.includes("$(jq -er '.commit.id' <<< \"$response\") == \"$GITHUB_SHA\""));
  assert.ok(deploy.includes('attempt<=60'));
  assert.ok(deploy.includes('for path in / /login'));
});

const cases = [
  ['no tags starts at 1.0.0', [], '1.0.0'],
  ['increments existing PATCH', ['v1.0.0'], '1.0.1'],
  ['sorts every component numerically', ['v1.9.99', 'v1.10.0', 'v0.99.99'], '1.10.1'],
  ['higher MAJOR wins', ['v2.0.0', 'v1.99.99'], '2.0.1'],
  ['highest stable PATCH wins over lower minor and next-minor prerelease',
    ['v3.12.9', 'v3.12.10', 'v3.11.999', 'v2.99.99', 'v3.13.0-rc.1'], '3.12.11'],
  ['ignores malformed, prerelease and nonversion tags',
    ['v1.0.0', 'v99.0.0-rc.1', 'v99.0.0+build', 'v01.0.0', 'v1.02.0', 'v1.0.03', '1.8.0', 'latest', 'v2.0', 'v3.0.0.0'], '1.0.1'],
  ['only invalid tags still starts at 1.0.0', ['latest', 'v2.0.0-rc.1'], '1.0.0'],
  ['large integers do not overflow', ['v9007199254740993.0.9007199254740993', 'v9007199254740992.99.99'],
    '9007199254740993.0.9007199254740994'],
];

for (const [name, tags, expected] of cases) {
  test(name, () => {
    assert.ok(versionStep, 'workflow must include actual version calculation');
    const cwd = mkdtempSync(join(tmpdir(), 'facea-version-'));
    try {
      git(cwd, 'init', '--quiet');
      git(cwd, 'config', 'user.name', 'Version Test');
      git(cwd, 'config', 'user.email', 'version@example.invalid');
      git(cwd, '-c', 'core.hooksPath=/dev/null', '-c', 'commit.gpgsign=false', 'commit', '--quiet', '--allow-empty', '-m', 'fixture');
      for (const tag of tags) git(cwd, '-c', 'tag.gpgsign=false', 'tag', tag);
      const before = {
        refs: git(cwd, 'show-ref'), head: git(cwd, 'rev-parse', 'HEAD'), status: git(cwd, 'status', '--porcelain'),
      };
      // Relative paths work with both Windows Node and Git Bash; no shell-quoted paths.
      writeFileSync(join(cwd, 'calculate.sh'), versionStep.run);
      const result = spawnSync('bash', ['calculate.sh'], {
        cwd, encoding: 'utf8', timeout: 10000,
        env: { ...process.env, GITHUB_ENV: 'version.env' },
      });
      assert.ifError(result.error);
      assert.equal(result.status, 0, result.stderr);
      assert.equal(result.stdout, '');
      assert.equal(result.stderr, '');
      assert.equal(readFileSync(join(cwd, 'version.env'), 'utf8'), `VERSION=${expected}\n`);
      assert.equal(git(cwd, 'show-ref'), before.refs);
      assert.equal(git(cwd, 'rev-parse', 'HEAD'), before.head);
      assert.equal(before.status, '');
      assert.equal(git(cwd, 'status', '--porcelain', '--untracked-files=no'), '');
      assert.deepEqual(readdirSync(cwd).sort(), ['.git', 'calculate.sh', 'version.env']);
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });
}
