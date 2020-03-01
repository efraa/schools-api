import { DatabaseConnection } from './database/DatabaseConnection'
import { Logger } from './infrastructure/utils/logging/Logger'

export class Server {
  constructor(private app: any) {}

  // Lauch Server
  public async start() : Promise<void> {
    try {
      await this.app.listen(async () => {
        const connected = await DatabaseConnection
          .connect()

        if (connected)
          console.log('[API SERVER]: running on port', this.app.port)
      })
    } catch (err) {
      Logger.error(err)
    }
  }
}
