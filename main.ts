import { Server } from './src/server'
import App from './src/app'
import { Logger } from './src/infrastructure/utils/logging/Logger'
 
class API {
  static async main(): Promise<void> {
    try {
      const server = new Server(App)
      await server.start()
    } catch (err) {
      Logger.error(err.message)
      process.exit()
    }
  }
}

API.main()
