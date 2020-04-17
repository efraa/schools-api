import { DatabaseConnection } from '../../../src/database/DatabaseConnection'

import { UserSeed } from './UserSeed'

const seeders = [
  new UserSeed()
]

const seedRunner = async () =>
  await DatabaseConnection.connect().then(async () => {
    try {
      console.log('Running seeds...')
      for (const seed of seeders) {
        await seed.init()
      }
      console.log('Done!, Seeders completed.')
    } catch (err) {
      console.log(err)
      process.exit()
    }
  })

seedRunner()
