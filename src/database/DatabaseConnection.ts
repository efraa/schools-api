import { createConnection } from 'typeorm'

const DatabaseConnection = {
  connect: async () => await createConnection()
}

export default DatabaseConnection
