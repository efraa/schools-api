import { DatabaseConnection } from './database/DatabaseConnection'

export class Server {
  constructor(private app: any) {}

  // Lauch Server
  public async start() : Promise<void> {
    try {
      await this.app.listen(async () => {
        const connected = await DatabaseConnection
          .connect()

        if (connected)
          console.log('Running on port', this.app.port)
      })
    } catch (err) {
      console.log(err)
    }
  }
}
