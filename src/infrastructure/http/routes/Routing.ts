
import { Router } from 'express'
import { Configuration } from '@config/Configuration'
import { Routes } from '@src/app.routes'

class Routing {
  public readonly router: Router = Router()

  public build() {
    const { prefixRoutes } = Configuration.server
    Routes.forEach(route => this.router.use(prefixRoutes as string, route))
    return this.router
  }
}

export default new Routing()
