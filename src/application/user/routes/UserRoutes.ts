import { BaseRoutes } from '../../../infrastructure/routes/BaseRoutes'
import { ResponseHandler, RouteMethod, statusCodes, ErrorHandler } from '../../../infrastructure/routes'
import { Response, RequestHandler, Request } from 'express'
import { UserController, validators, UserDTO, UserResponses, Roles } from '../providers/UserProvider'
import { ensureAuth } from '../../../infrastructure/middleware/AuthMiddle'
import { userPictureMiddle } from '../../../infrastructure/middleware/uploads'

export class UserRoutes extends BaseRoutes {

  constructor(modulePath: string, private _UserController: UserController) {
    super(modulePath)
    this.addRoutes()
  }

  addRoutes() {
    this.api.post('/signup', validators.signup, this.signupAsSchool)
    this.api.post('/login', validators.login, this.login)
    this.api.post('/forgot-password', validators.forgotPassword, this.forgotPassword)
    this.api.get('/forgot-password-expire/:token', validators.forgotPassExpire, this.checkPasswordExpire)
    this.api.put('/reset-password/:token', validators.resetPass, this.resetPassword)
    // Upload Picture
    this.api.put('/:id/picture', [ensureAuth, userPictureMiddle], this.upload)
    this.api.post('/verify-email', validators.verifyEmail, this.checkEmail)
    this.api.post('/verify-email-code', validators.verifyEmailWithCode, this.verifyEmailWithCode)
    // Get current user (Logged) info
    this.api.get('/logged', ensureAuth, this.userLoggedWithAccountInfo)
  }

  public signupAsSchool: RequestHandler = (req: Request, res: Response) =>
    RouteMethod.build({
      resolve: async () => {
        const user = await this._UserController.create({
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
        const userLogged = await this._UserController.login(req.body)
        if (userLogged)
          return res
            .status(statusCodes.OK)
            .send(ResponseHandler.build(userLogged, false))
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

  public verifyEmailWithCode: RequestHandler = (req: Request, res: Response) =>
    RouteMethod.build({
      resolve: async () => {
        const email = await this._UserController.verifyEmailWithCode(req.body.email, req.body.code)
        if (email)
          return res
            .status(statusCodes.OK)
            .send(ResponseHandler.build(email, false))
      }, req, res
    })

  public userLoggedWithAccountInfo: RequestHandler = (req: Request, res: Response) =>
    RouteMethod.build({
      resolve: async () => {
        const userLogged = await this._UserController.userLoggedWithAccountInfo(req.user.id)
        if (userLogged)
          return res
            .status(statusCodes.OK)
            .send(ResponseHandler.build(userLogged, false))
      }, req, res
    })
}
