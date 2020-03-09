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
}
