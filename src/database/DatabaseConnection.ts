import { createConnection, Connection } from 'typeorm'
import dotenv from 'dotenv'
dotenv.config()

let instance: Connection|undefined = undefined
export const DatabaseConnection = {
  connect: async () => {
    if (!instance) {
      instance = await createConnection({
        type: 'postgres',
        host: process.env.DB_HOST,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        logging: false,
        synchronize: true,
        entities: ['src/**/*.entity.ts']
      })
    }

    return instance
  }
}
