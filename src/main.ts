import { DatabaseConnection } from './database/DatabaseConnection'
import { Application, Router } from 'express'

// Modules
import { UserModule } from './application/user/modules/UserModule'
import { UserRoutes } from './application/user/routes/UserRoutes'

export class Main {
  protected router: Router = Router()

  constructor(protected prefixRoute: string, protected app: Application) {
    this.app.use(this.prefixRoute, this.router)
  }

  public async init() {
    await this.databaseConnection()
    await this.buildRouting()
  }

  public async databaseConnection() {
    const connected = await DatabaseConnection
      .connect()

    if (connected)
      console.log(`[DATABASE]: connected on host: ${process.env.DB_HOST}`)
  }

  public buildRouting() {
    // Routes
    const userRoutes = new UserRoutes(this.router, UserModule.getUserController()).routes
    this.router.use('/users', userRoutes)
  }
}