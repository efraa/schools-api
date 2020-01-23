import { Router, Response, RequestHandler, Request } from 'express'
import { ResponseHandler, RouteMethod, statusCodes } from '../../infrastructure/http/routes'

import { AuthController } from './auth.providers'
import { validators } from './utils/auth.validator'

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

    // Forgot Password
    this.api.post(
      '/forgot-password',
      validators.forgotPassword as Array<any>,
      this.forgotPassword
    )

    // Check Password Expire
    this.api.get(
      '/forgot-password-expire/:token',
      validators.forgotPassExpire as Array<any>,
      this.checkPasswordExpire
    )

    // Reset Password
    this.api.put(
      '/reset-password/:token',
      validators.resetPass as Array<any>,
      this.resetPassword
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

  public forgotPassword: RequestHandler = (req: Request, res: Response) =>
    RouteMethod.build({
      resolve: async () => {
        const response = await AuthController.forgotPassword(req.body.email)
        if (response)
          return res
            .status(statusCodes.OK)
            .send(ResponseHandler.build(response))
      }, req, res
    })

  public checkPasswordExpire: RequestHandler = (req: Request, res: Response) =>
    RouteMethod.build({
      resolve: async () => {
        const response = await AuthController.checkPasswordExpire(req.params.token)
        if (response)
          return res
            .status(statusCodes.OK)
            .send(ResponseHandler.build(response, false))
      }, req, res
    })

  public resetPassword: RequestHandler = (req: Request, res: Response): Promise<any> =>
    RouteMethod.build({
      resolve: async () => {
        const response = await AuthController.resetPassword(req.params.token, req.body.password)
        if (response)
          return res
            .status(statusCodes.OK)
            .send(ResponseHandler.build(response))
      }, req, res
    })
}

export default new AuthRoutes().routes
