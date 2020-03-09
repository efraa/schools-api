import { ResponseHandler, RouteMethod, statusCodes } from '../../../infrastructure/routes'
import { Router, Response, RequestHandler, Request } from 'express'
import { UserController, validators } from '../providers/UserProvider'

export class UserRoutes {
  constructor(private api: Router, private _UserController: UserController) {}

  public get routes(): Router {
    // Sign up
    this.api.post(
      '/signup',
      validators.signup,
      this.signupAsSchool
    )

    // Login
    this.api.post(
      '/login',
      validators.login,
      this.login
    )

    // Forgot Password
    this.api.post(
      '/forgot-password',
      validators.forgotPassword,
      this.forgotPassword
    )

    // Check Password Expire
    this.api.get(
      '/forgot-password-expire/:token',
      validators.forgotPassExpire,
      this.checkPasswordExpire
    )

    // Reset Password
    this.api.put(
      '/reset-password/:token',
      validators.resetPass,
      this.resetPassword
    )

    return this.api
  }

  public signupAsSchool: RequestHandler = (req: Request, res: Response) =>
    RouteMethod.build({
      resolve: async () => {
        const user = await this._UserController.signupAsSchool(req.clientInfo as ClientInfo, req.body)
        if (user)
          return res
            .status(statusCodes.CREATE)
            .send(ResponseHandler.build(user, false))
      }, req, res
    })

  public login: RequestHandler = (req: Request, res: Response) =>
    RouteMethod.build({
      resolve: async () => {
        const session = await this._UserController.login(req.clientInfo as ClientInfo, req.body)
        if (session)
          return res
            .status(statusCodes.OK)
            .send(ResponseHandler.build(session, false))
      }, req, res
    })

  public forgotPassword: RequestHandler = (req: Request, res: Response) =>
    RouteMethod.build({
      resolve: async () => {
        const response = await this._UserController.forgotPassword(req.body.email)
        if (response)
          return res
            .status(statusCodes.OK)
            .send(ResponseHandler.build(response))
      }, req, res
    })

  public checkPasswordExpire: RequestHandler = (req: Request, res: Response) =>
    RouteMethod.build({
      resolve: async () => {
        const response = await this._UserController.checkPasswordExpire(req.params.token)
        if (response)
          return res
            .status(statusCodes.OK)
            .send(ResponseHandler.build(response, false))
      }, req, res
    })

  public resetPassword: RequestHandler = (req: Request, res: Response) =>
    RouteMethod.build({
      resolve: async () => {
        const response = await this._UserController.resetPassword(req.params.token, req.body.password)
        if (response)
          return res
            .status(statusCodes.OK)
            .send(ResponseHandler.build(response))
      }, req, res
    })
}
