import { UserService, UserResponses, UserDTO } from '../providers/UserProvider'
import { ErrorHandler, statusCodes } from '../../../infrastructure/routes'
import { Worker } from '../../../../workers'
import { Configuration as config } from '../../../../config/Configuration'
import { SessionService } from '../providers/SessionProvider'
import { User } from 'src/database/entities/User'

export class UserController {
  constructor(
    private _UserService: UserService,
    private _SessionService: SessionService,
  ) {}

  public async create(device: ClientInfo, userPayload: UserPayload) {
    const user = await this._UserService.mapToEntity(userPayload)
    const emailExists = await this._UserService.getUserByEmail(user.email as string)
    const usernameExists = await this._UserService.getUserByUsername(user.username)

    if (emailExists)
      throw ErrorHandler.build(statusCodes.BAD_REQUEST, UserResponses.EMAIL_EXISTS)

    if (usernameExists)
      throw ErrorHandler.build(statusCodes.BAD_REQUEST, UserResponses.USERNAME_EXISTS)

    const created = await this._UserService.create(user)
    if (created) {
      await Worker.EmailJob.add({
        to: user.email as string,
        subject: UserResponses.SUBJECT.WELCOME_NEW_USER,
        template: 'newUser',
        data: {}
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
          url: `${config.forgotPass.url}/reset-password/${token}`
        }
      })

      return UserResponses.EMAIL_SENT
    }
  }

  // Verify that the forgotten token password has not yet expired.
  public checkPasswordExpire = async (token: string) => {
    const user = await this._UserService.checkPasswordExpire(token)
    if (user)
      return {
        token: user.forgotToken,
        status: 'active'
      }

    throw ErrorHandler.build(statusCodes.UNAUTHORIZED, UserResponses.UNAUTHORIZED)
  }

  // Receive the token and the new password and return confirmation message.
  public resetPassword = async (token: string, password: string): Promise<string> =>
    await this._UserService.resetPassword(token, password)

  public async upload(props: {
    id: number,
    userLogged: UserDTO,
    picture: {
      path: string,
      name: string,
    }
  }) {
    const { id, userLogged, picture } = props
    if (userLogged.id === id) {
      const user = await this._UserService.getUserById(id)
      return await this._UserService.upload(user as User, picture)
    }

    throw ErrorHandler.build(statusCodes.UNAUTHORIZED, UserResponses.UNAUTHORIZED)
  }
}
