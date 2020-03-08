import { UserService, UserResponses, Roles } from '../providers/UserProvider'
import { UserPayload } from '../utils/UserPayload'
import { ErrorHandler, statusCodes } from '../../../infrastructure/routes'
import { JWToken } from '../../../infrastructure/utils'

export class UserController {
  constructor(private _UserService: UserService) {}

  public async signupAsSchool(schoolPayload: UserPayload): Promise<{
    token: string
  }> {
    const school = await this._UserService.mapToEntity({ ...schoolPayload, role: Roles.SCHOOL})
    const emailExists = await this._UserService.getUserByEmail(school.email as string)
    const usernameExists = await this._UserService.getUserByUsername(school.username)

    if (emailExists)
      throw ErrorHandler.build(statusCodes.BAD_REQUEST, UserResponses.EMAIL_EXISTS)

    if (usernameExists)
      throw ErrorHandler.build(statusCodes.BAD_REQUEST, UserResponses.USERNAME_EXISTS)

    return await JWToken.generateToken(await this._UserService.create(school))
  }
}
