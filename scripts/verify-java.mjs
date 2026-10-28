// Runs the opt-in Java verification suite (needs a local JDK: javac + java on PATH).
import { spawnSync } from 'node:child_process'

const probe = spawnSync('javac', ['-version'], { stdio: 'pipe', shell: true })
if (probe.status !== 0) {
  console.error('javac was not found on PATH. Install a JDK (17+) to run `npm run verify:java`.')
  process.exit(1)
}
const r = spawnSync('npx', ['vitest', 'run', 'tests/java.verify.test.ts', '--testTimeout=60000'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, VERIFY_JAVA: '1' },
})
process.exit(r.status ?? 1)
