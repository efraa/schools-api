import { createConnection, Connection } from 'typeorm'

export class DatabaseConnection {
  private connection: Connection

  public async connect() : Promise<Connection> {
    if (this.connection == undefined)
      this.connection = await createConnection()

    return this.connection
  }
}
