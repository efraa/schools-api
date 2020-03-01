import { Router, Response, RequestHandler, Request } from 'express'
import { ResponseHandler, RouteMethod, statusCodes } from '../../infrastructure/http/routes'

import { UserController, UserDTO } from './user.providers'
// import { validators } from '@app/auth/utils/auth.validator'
import { ensureAuth } from '../../infrastructure/middleware/AuthenticationMiddleware'
import { userPictureMiddleware } from '../../infrastructure/middleware/uploadsMiddleware/userPictureMiddleware'

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

    // List of members
    this.api.get('/members', ensureAuth, this.listOfMembers)

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

  public listOfMembers: RequestHandler = (req: Request, res: Response) =>
    RouteMethod.build({
      resolve: async () => {
        if (!req.user) return
        const { page, perPage, search, role, status } = req.query
        const user = await UserController.listOfMembers({
          userLogged: req.user as UserDTO,
          page,
          perPage,
          search,
          role,
          status,
        })
        if (user)
          return res
            .status(statusCodes.OK)
            .send(ResponseHandler.build(user, false))
      }, req, res
    })
}

export default new UserRoutes().routes
