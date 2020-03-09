import { UserService, Roles, UserResponses } from '../providers/UserProvider'
import { SessionService } from '../providers/SessionProvider'
import { UserPayload } from '../utils/UserPayload'
import { ErrorHandler, statusCodes } from '../../../infrastructure/routes'
import { Worker } from '../../../../workers'
import { SchoolController } from './SchoolController'
import { Configuration as config } from '../../../../config/Configuration'

export class UserController {
  constructor(
    private _UserService: UserService,
    private _SessionService: SessionService,
    private _SchoolController: SchoolController,
  ) {}

  public async signupAsSchool(device: ClientInfo, userPayload: UserPayload): Promise<{
    token: string
  }|undefined> {
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

    const session = await this._SessionService.create(device, created)
    if (session)
      return session
  }

  public async login(device: ClientInfo, userPayload: {
    emailOrUsername: string,
    password: string
  }) {
    const user = await this._UserService.login(userPayload.emailOrUsername, userPayload.password)
    if (user && user.id) {
      const session = await this._SessionService.create(device, user)
      if (session)
        return session
    }
  }

  public async forgotPassword(email: string) {
    const { token, user } = await this._UserService.forgotPassword(email)
    if (token && user) {
      await Worker.EmailJob.add({
        to: email,
        subject: UserResponses.SUBJECT.PASSWORD_RESET,
        template: 'forgotPassword',
        data: {
          name: user.name,
          url: `${config.forgotPass.url}/reset-password/${token}`
        }
      })

      return UserResponses.EMAIL_SENT
    }
  }

  // Verify that the forgotten token password has not yet expired.
  public checkPasswordExpire = async (token: string) => {
    const user = await this._UserService.checkPasswordExpire(token)
    const { name, lastname, username, picture } = user

    return {
      name,
      lastname,
      username,
      picture,
    }
  }

  // Receive the token and the new password and return confirmation message.
  public resetPassword = async (token: string, password: string): Promise<string> =>
    await this._UserService.resetPassword(token, password)
}
