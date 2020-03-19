import { BaseRoutes } from '../../../infrastructure/routes/BaseRoutes'
import { ResponseHandler, RouteMethod, statusCodes } from '../../../infrastructure/routes'
import { Response, RequestHandler, Request } from 'express'
import { StudentController, validators } from '../providers/StudentProvider'
import { ensureAuth } from '../../../infrastructure/middleware/AuthMiddle'
import { UserDTO } from '../../user/domain/dtos/UserDTO'

export class StudentRoutes extends BaseRoutes {

  constructor(modulePath: string, private _StudentController: StudentController) {
    super(modulePath)
    this.addRoutes()
  }

  addRoutes() {
    this.api.post('/create', ensureAuth, this.create)
  }

  public create: RequestHandler = (req: Request, res: Response) =>
    RouteMethod.build({
      resolve: async () => {
        const student = await this._StudentController.create(req.user as UserDTO, req.body)
        if (student)
          return res
            .status(statusCodes.CREATE)
            .send(ResponseHandler.build(student, false))
      }, req, res
    })
}
