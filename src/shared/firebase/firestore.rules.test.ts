import { readFileSync } from 'node:fs'
import {
  assertFails,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing'
import { doc, getDoc } from 'firebase/firestore'
import { afterAll, afterEach, beforeAll, describe, it } from 'vitest'

let testEnvironment: RulesTestEnvironment

beforeAll(async () => {
  testEnvironment = await initializeTestEnvironment({
    projectId: 'demo-foodbridge-local',
    firestore: {
      host: '127.0.0.1',
      port: 8080,
      rules: readFileSync('firestore.rules', 'utf8'),
    },
  })
})

afterEach(async () => {
  await testEnvironment.clearFirestore()
})

afterAll(async () => {
  await testEnvironment?.cleanup()
})

describe('Phase 0 Firestore rules', () => {
  it('deny unauthenticated reads until scoped rules are implemented', async () => {
    const database = testEnvironment.unauthenticatedContext().firestore()

    await assertFails(getDoc(doc(database, 'users', 'example-user')))
  })
})
