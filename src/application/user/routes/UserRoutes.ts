import { ResponseHandler, RouteMethod, statusCodes, ErrorHandler } from '../../../infrastructure/routes'
import { Router, Response, RequestHandler, Request } from 'express'
import { UserController, validators, UserDTO, UserResponses, Roles } from '../providers/UserProvider'
import { ensureAuth } from '../../../infrastructure/middleware/AuthMiddle'
import { userPictureMiddle } from '../../../infrastructure/middleware/uploads'

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

    // Upload Picture
    this.api.put('/:id/picture',
      [ensureAuth, userPictureMiddle],
      this.upload
    )

    // Verify Email
    this.api.post('/verify-email',
      validators.verifyEmail,
      this.checkEmail
    )

    return this.api
  }

  public signupAsSchool: RequestHandler = (req: Request, res: Response) =>
    RouteMethod.build({
      resolve: async () => {
        const user = await this._UserController.create(req.clientInfo as ClientInfo, {
          ...req.body,
          role: Roles.SCHOOL
        })
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

  public upload: RequestHandler = (req: Request, res: Response) =>
    RouteMethod.build({
      resolve: async () => {
        if (!req.file)
          throw ErrorHandler.build(statusCodes.BAD_REQUEST, UserResponses.INVALID_FILE_EXT)

        const uploaded = await this._UserController.upload({
          userLogged: req.user as UserDTO,
          id: parseInt(req.params.id),
          picture: {
            path: req.file.path,
            name: req.file.filename
          }
        })
        if (uploaded)
          return res
            .status(statusCodes.OK)
            .send(ResponseHandler.build(uploaded, false))
      }, req, res
    })

  public checkEmail: RequestHandler = (req: Request, res: Response) =>
    RouteMethod.build({
      resolve: async () => {
        const response = await this._UserController.checkEmail(req.body.email)
        if (response)
          return res
            .status(statusCodes.OK)
            .send(ResponseHandler.build(response))
      }, req, res
    })
}
