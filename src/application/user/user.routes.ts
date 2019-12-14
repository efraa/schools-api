import { Router, Response, Request, RequestHandler } from 'express'
// import path from 'path'

export class UserRoutes {
  readonly api: Router = Router()

  constructor () {}

  public get routes(): Router {
    return this.api
  }
}
