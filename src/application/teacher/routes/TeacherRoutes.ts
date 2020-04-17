import { BaseRoutes } from '../../../infrastructure/routes/BaseRoutes'
import { ResponseHandler, RouteMethod, statusCodes } from '../../../infrastructure/routes'
import { Response, RequestHandler, Request } from 'express'
import { TeacherController, validators } from '../providers/TeacherProvider'
import { ensureAuth } from '../../../infrastructure/middleware/AuthMiddle'
import { UserDTO } from '../../user/domain/dtos/UserDTO'

export class TeacherRoutes extends BaseRoutes {

  constructor(modulePath: string, private _TeacherController: TeacherController) {
    super(modulePath)
    this.addRoutes()
  }

  addRoutes() {
    this.api.post('/create', validators.create, ensureAuth, this.create)
  }

  public create: RequestHandler = (req: Request, res: Response) =>
    RouteMethod.build({
      resolve: async () => {
        const teacher = await this._TeacherController.create(req.user as UserDTO, req.body)
        // if (teacher)
          return res
            .status(statusCodes.CREATE)
            .send(ResponseHandler.build(teacher, false))
      }, req, res
    })
}
