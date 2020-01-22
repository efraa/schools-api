import { Router, Response, RequestHandler, Request } from 'express'
import { ResponseHandler, RouteMethod, statusCodes } from '@http/routes'

import { UserController, UserDTO } from './user.providers'
// import { validators } from '@app/auth/utils/auth.validator'
import { ensureAuth } from '@middlewares/AuthenticationMiddleware'
import { userPictureMiddleware } from '@middlewares/uploadsMiddleware/userPictureMiddleware'

class UserRoutes {
  readonly api: Router = Router()

  public get routes(): Router {
    //
    this.api.route('/user/:username')
      .get(
        ensureAuth,
        this.get
      )

    // Upload Picture
    this.api.put('/user-picture/:username',
      [ensureAuth, userPictureMiddleware],
      this.upload
    )

    return this.api
  }

  public get: RequestHandler = (req: Request, res: Response) =>
    RouteMethod.build({
      resolve: async () => {
        const user = await UserController.get(req.params.username, req.user as UserDTO)
        if (user)
          return res
            .status(statusCodes.OK)
            .send(ResponseHandler.build(user, false))
      }, req, res
    })

  public upload: RequestHandler = (req: Request, res: Response) =>
    RouteMethod.build({
      resolve: async () => {
        const user = await UserController.upload({
          userLogged: req.user as UserDTO,
          username: req.params.username,
          picture: {
            path: req.file.path,
            name: req.file.filename,
          },
        })
        if (user)
          return res
            .status(statusCodes.OK)
            .send(ResponseHandler.build(user, false))
      }, req, res
    })
}

export default new UserRoutes().routes
