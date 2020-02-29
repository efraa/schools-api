import { validationResult } from 'express-validator'
import { ResponseHandler, statusCodes } from '.'
import { Logger } from '../../utils/logging/Logger'

export class RouteMethod {
  public static async build({ req, res, resolve }: any) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      errors.array().map(err =>
        Logger.info(`${err.param.toUpperCase()} VALIDATOR ERROR: ${err.msg}`))
      return res
        .status(statusCodes.BAD_REQUEST)
        .send(ResponseHandler.build(errors.array(), false))
    }

    try {
      await resolve()
    } catch (err) {
      if (!err.statusCode) Logger.error(`[${err.name}]: ${err.message}`)
      return res
        .status(err.statusCode || statusCodes.INTERNAL_ERROR)
        .send(ResponseHandler.build(err.message))
    }
  }
}
