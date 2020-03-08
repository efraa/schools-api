import { UserService, Roles, UserResponses } from '../providers/UserProvider'
import { SessionDTO, SessionService } from '../providers/SessionProvider'
import { UserPayload } from '../utils/UserPayload'
import { ErrorHandler, statusCodes } from '../../../infrastructure/routes'
import { Worker } from '../../../../workers'
import { SchoolController } from './SchoolController'

export class UserController {
  constructor(
    private _UserService: UserService,
    private _SessionService: SessionService,
    private _SchoolController: SchoolController,
  ) {}

  public async signupAsSchool(device: ClientInfo, userPayload: UserPayload): Promise<{
    token: string
  }> {
    const user = await this._UserService.mapToEntity({ ...userPayload, role: Roles.SCHOOL})
    const emailExists = await this._UserService.getUserByEmail(user.email as string)
    const usernameExists = await this._UserService.getUserByUsername(user.username)

    if (emailExists)
      throw ErrorHandler.build(statusCodes.BAD_REQUEST, UserResponses.EMAIL_EXISTS)

    if (usernameExists)
      throw ErrorHandler.build(statusCodes.BAD_REQUEST, UserResponses.USERNAME_EXISTS)

    const created = await this._UserService.create(user)
    if (created) {
      await this._SchoolController.create(created)

      await Worker.EmailJob.add({
        to: user.email as string,
        subject: UserResponses.SUBJECT.WELCOME_SIGNUP_AS_SCHOOL,
        template: 'signupAsSchool',
        data: {
          name: user.name
        }
      })
    }

    return await this._SessionService.create(device, created)
  }
}
