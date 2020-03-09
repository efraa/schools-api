import { Response, NextFunction, Request } from 'express'
import { ResponseHandler, statusCodes } from '../routes'
import { JWToken } from '../utils/JWToken'
import { Logger } from '../utils/logging/Logger'

export const ensureAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.get('authorization')
    const message = 'The request does not have the authorization headers.'
    if (!token) {
      Logger.info(message)
      return res
        .status(statusCodes.INTERNAL_ERROR)
        .send(ResponseHandler.build(message))
    }

    const isValidToken = await JWToken.verifyToken(token)
    if (isValidToken) {
      req.user = isValidToken.user
      next()
    }
  } catch (e) {
    Logger.error(`[TOKEN ERROR]: ${e.name}, ${e.message}`)
    return res
      .status(statusCodes.UNAUTHORIZED)
      .send(ResponseHandler.build('An error occurred with the token verification.'))
  }
}
