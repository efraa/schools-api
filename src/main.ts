import { DatabaseConnection } from './database/DatabaseConnection'
import { Application, Router } from 'express'
import { Routes } from './routes'

export class Main {
  protected router: Router = Router()

  constructor(protected prefixRoute: string, protected app: Application) {
    this.app.use(this.prefixRoute, this.router)
  }

  public async init() {
    await this.databaseConnection()
    this.buildRouting()
  }

  public databaseConnection = async () =>
    await DatabaseConnection
      .connect().then(connection =>
        console.log(`[DATABASE]: connected to ${connection.options.database} database`))

  public buildRouting = () => new Routes(this.router)
}
