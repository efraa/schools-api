import { BaseRoutes } from '../../../infrastructure/routes/BaseRoutes'
import { ResponseHandler, RouteMethod, statusCodes } from '../../../infrastructure/routes'
import { Response, RequestHandler, Request } from 'express'
import { SchoolController, validators } from '../providers/SchoolProvider'
import { ensureAuth } from '../../../infrastructure/middleware/AuthMiddle'
import { UserDTO } from '../../../application/user/domain/dtos/UserDTO'

export class SchoolRoutes extends BaseRoutes {

  constructor(modulePath: string, private _SchoolController: SchoolController) {
    super(modulePath)
    this.addRoutes()
  }

  addRoutes() {
    this.api.post('/create', validators.create, ensureAuth, this.create)
  }

  public create: RequestHandler = (req: Request, res: Response) =>
    RouteMethod.build({
      resolve: async () => {
        const school = await this._SchoolController.create(req.user as UserDTO, req.body)
        if (school)
          return res
            .status(statusCodes.CREATE)
            .send(ResponseHandler.build(school, false))
      }, req, res
    })
}
