import { createConnection, Connection } from 'typeorm'
import dotenv from 'dotenv'
dotenv.config()

let instance: Connection|undefined = undefined
const ssl = process.env.SSL ? true : false
export const DatabaseConnection = {
  connect: async () => !instance ?
    (instance = await createConnection({
      type: 'postgres',
      host: process.env.DB_HOST,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      logging: false,
      synchronize: process.env.SYNCHRONIZE as any,
      entities: [process.env.ENTITIES || 'build/src/**/*.entity.js'],
      ssl,
    })) : instance
}
