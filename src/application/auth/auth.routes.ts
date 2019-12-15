import { Router, Response, RequestHandler, Request } from 'express'
import { ResponseHandler, RouteMethod, statusCodes } from '@http/routes'

import { AuthController } from './auth.providers'
import { validators } from '@app/auth/utils/auth.validator'

class AuthRoutes {
  readonly api: Router = Router()

  public get routes(): Router {
    // Sign up
    this.api.post(
      '/signup',
      validators.signup as Array<any>,
      this.signup
    )

    // Log in
    this.api.post(
      '/auth',
      validators.authentication as Array<any>,
      this.auth
    )

    return this.api
  }

  public signup: RequestHandler = (req: Request, res: Response) =>
    RouteMethod.build({
      resolve: async () => {
        const user = await AuthController.signup(req.body)
        if (user)
          return res
            .status(statusCodes.CREATE)
            .send(ResponseHandler.build(user, false))
      }, req, res
    })

  public auth: RequestHandler = (req: Request, res: Response) =>
    RouteMethod.build({
      resolve: async () => {
        const user = await AuthController.auth(req.body)
        if (user)
          return res
            .status(statusCodes.OK)
            .send(ResponseHandler.build(user, false))
      }, req, res
    })
}

export default new AuthRoutes().routes
