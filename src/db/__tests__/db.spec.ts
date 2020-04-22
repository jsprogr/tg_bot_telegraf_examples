import { createTestConfig } from '../../config'
import { createPgDB, initializePgDB, PgDBT, destroyPgDb } from '../db'

describe('Check create and destroy DB', () => {
  let config
  let pgDB: PgDBT

  beforeAll(async () => {
    config = createTestConfig()
    pgDB = createPgDB(config.db_section)
    await initializePgDB(pgDB)
  })

  test('Create PgDB test', () => {
    const config = createTestConfig()

    const pgDB = createPgDB(config.db_section)

    expect(pgDB).toBeDefined()

    expect(pgDB).toHaveProperty('db', expect.any(Object))
    expect(pgDB).toHaveProperty('pgp', expect.any(Function))
  })

  afterAll(async () => {
    await destroyPgDb(pgDB)
  })
})
