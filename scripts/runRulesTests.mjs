import { spawn, spawnSync } from 'node:child_process'

const projectId = 'demo-foodbridge-local'
const firestoreEmulatorUrl = 'http://127.0.0.1:8080'
const firebaseCli = 'node_modules/firebase-tools/lib/bin/firebase.js'
const vitestCli = 'node_modules/vitest/vitest.mjs'

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

async function waitForFirestoreEmulator(timeoutMilliseconds = 30_000) {
  const deadline = Date.now() + timeoutMilliseconds

  while (Date.now() < deadline) {
    try {
      const response = await fetch(firestoreEmulatorUrl)

      if (response.ok) {
        return
      }
    } catch {
      // The hub is not ready yet; retry until the timeout.
    }

    await delay(250)
  }

  throw new Error('Firestore Emulator did not become ready within 30 seconds.')
}

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit' })

    child.once('error', reject)
    child.once('exit', (code) => resolve(code ?? 1))
  })
}

function stopProcessTree(processId) {
  if (!processId) {
    return
  }

  if (process.platform === 'win32') {
    spawnSync('taskkill', ['/pid', String(processId), '/T', '/F'], {
      stdio: 'ignore',
    })
    return
  }

  process.kill(processId, 'SIGTERM')
}

const emulator = spawn(
  process.execPath,
  [
    firebaseCli,
    'emulators:start',
    '--project',
    projectId,
    '--only',
    'firestore',
  ],
  { stdio: 'inherit' },
)

try {
  await waitForFirestoreEmulator()
  const exitCode = await run(process.execPath, [
    vitestCli,
    'run',
    '--config',
    'vitest.rules.config.ts',
  ])
  process.exitCode = exitCode
} catch (error) {
  console.error(
    error instanceof Error ? error.message : 'Rules test setup failed.',
  )
  process.exitCode = 1
} finally {
  stopProcessTree(emulator.pid)
}
