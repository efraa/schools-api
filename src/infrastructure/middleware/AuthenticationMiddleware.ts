import { Response, NextFunction, Request } from 'express'
import { ResponseHandler, statusCodes } from '../http/routes'
import { JWToken } from '../utils/JWToken'

export const ensureAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.get('authorization')
    if (!token)
      return res
        .status(statusCodes.INTERNAL_ERROR)
        .send(ResponseHandler.build('The request does not have the authorization headers.'))

    const isValidToken = await JWToken.verifyToken(token)
    if (isValidToken)
      req.user = isValidToken.user
      next()

  } catch (e) {
    return res
      .status(statusCodes.UNAUTHORIZED)
      .send(ResponseHandler.build('An error occurred with the token verification.'))
  }
}
