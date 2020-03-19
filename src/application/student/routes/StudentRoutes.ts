import { ResponseHandler, RouteMethod, statusCodes } from '../../../infrastructure/routes'
import { Router, Response, RequestHandler, Request } from 'express'
import { StudentController, validators } from '../providers/StudentProvider'
import { ensureAuth } from '../../../infrastructure/middleware/AuthMiddle'
import { UserDTO } from '../../user/domain/dtos/UserDTO'

export class StudentRoutes {
  constructor(private api: Router, private _StudentController: StudentController) {}

  public get routes(): Router {
    this.api.post(
      '/create',
      validators.create,
      ensureAuth,
      this.create
    )

    return this.api
  }

  public create: RequestHandler = (req: Request, res: Response) =>
    RouteMethod.build({
      resolve: async () => {
        const student = await this._StudentController.create(req.user as UserDTO, req.body)
        // if (student)
          return res
            .status(statusCodes.CREATE)
            .send(ResponseHandler.build(student, false))
      }, req, res
    })
}
