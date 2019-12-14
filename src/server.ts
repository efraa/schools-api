import { DatabaseConnection } from '@database/DatabaseConnection'

export class Server {
  constructor(private app: any) {}

  // Lauch Server
  public async start() : Promise<void> {
    try {
      const connected = await new DatabaseConnection()
        .connect()

      if (connected)
        await this.app.listen() // API: running on port ${port}

    } catch (err) {
      console.log(err)
    }
  }
}
