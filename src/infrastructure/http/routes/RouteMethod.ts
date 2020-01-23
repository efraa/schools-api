import { validationResult } from 'express-validator'
import { ResponseHandler, statusCodes } from '.'

export class RouteMethod {
  public static async build({ req, res, resolve }: any) {
    const errors = validationResult(req)
    if (!errors.isEmpty())
      return res
        .status(statusCodes.BAD_REQUEST)
        .send(ResponseHandler.build(errors.array(), false))

    try {
      await resolve()
    } catch (err) {
      return res
        .status(err.statusCode || statusCodes.INTERNAL_ERROR)
        .send(ResponseHandler.build(err.message))
    }
  }
}
