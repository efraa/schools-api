import { Response, NextFunction, Request } from 'express'
import { Roles } from '@app/user/user.providers'

export class OwnerMiddleware implements ownerMiddleware {
  constructor(
    private ResponseHandler: responseHandler,
    private codes: statusCodes
  ) {}

  public isOwner = (req: Request, res: Response, next: NextFunction) => {
    const { user } = req
    if (user && user.role !== Roles.owner)
      return res
        .status(this.codes.UNAUTHORIZED)
        .send(this.ResponseHandler.build('You are not authorized for this request.'))

    next()
  }
}
