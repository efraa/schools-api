import { UserService, UserResponses, UserDTO } from '../providers/UserProvider'
import { ErrorHandler, statusCodes } from '../../../infrastructure/routes'
import { Worker } from '../../../../workers'
import { Configuration as config } from '../../../../config/Configuration'
import { User } from 'src/database/entities/User'
import { EmailService } from '../providers/EmailProvider'
import { JWToken } from '../../../infrastructure/utils'

export class UserController {
  constructor(
    private _UserService: UserService,
    private _EmailService: EmailService
  ) {}

  public async create(userPayload: UserPayload) {
    const user = await this._UserService.mapToEntity(userPayload)
    const emailExists = await this._UserService.getUserByEmail(user.email as string)

    if (emailExists)
      throw ErrorHandler.build(statusCodes.BAD_REQUEST, UserResponses.EMAIL_EXISTS)

    let created = await this._UserService.create(user)
    if (created) {
      await Worker.EmailJob.add({
        to: user.email as string,
        subject: UserResponses.SUBJECT.WELCOME_NEW_USER,
        template: 'newUser',
        data: {}
      })
    }

    return await JWToken.generateToken(created)
  }

  public login = async (user: { emailOrUsername: string, password: string }) =>
    await this._UserService.login(user.emailOrUsername, user.password)
      .then(async userLogged => await JWToken.generateToken(userLogged))

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

  public userLoggedWithAccountInfo = async (userId: number) =>
    await this._UserService.getUserWithAccountInfo(userId)

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

  public async checkEmail(emailString: string) {
    const emailEntity = await this._EmailService.getOrCreateEmailAndGenerateCode(emailString)
    const { email, code, expire } = emailEntity

    if (emailEntity) {
      await Worker.EmailJob.add({
        to: email,
        subject: UserResponses.SUBJECT.VERIFY_EMAIL,
        template: 'verifyEmail',
        data: {
          code
        }
      })

      await Worker.RemoveEmailJob.add({ email, expire })

      return UserResponses.EMAIL_SENT
    }
  }

  public verifyEmailWithCode = async (emailString: string, code: number) =>
    await this._EmailService.verifyEmailCode(emailString, code)
}
