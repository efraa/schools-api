import { Server } from '@src/server'
import App from '@src/app'

class API {
  static async main(): Promise<void> {
    try {
      const server = new Server(App)
      await server.start()
    } catch (err) {
      console.error(err)
      process.exit()
    }
  }
}

API.main()
