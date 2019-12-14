import { Router, Response, RequestHandler, Request } from 'express'
import { ResponseHandler, RouteMethod, statusCodes } from '@http/routes'

import {
  AuthController
} from './auth.providers'

class AuthRoutes {
  readonly api: Router = Router()

  public get routes(): Router {
    /**
    * @description Sign up
    * @public
    */
    this.api.post(
      '/signup',
      this.signup
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
}

export default new AuthRoutes().routes
