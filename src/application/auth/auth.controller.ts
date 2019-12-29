import { Configuration as config } from '@config/Configuration'
import { AuthService, AuthResponses } from './auth.providers'
import EmailService from '@utils/EmailService'

export class AuthController {
  public signup = async (user: any): Promise<{
    token: string
  }> => await AuthService.signup(user)

  public auth = async (user: {
    emailOrUsername: string,
    password: string
  }): Promise<{
    token: string
  }> => await AuthService.auth(user)

  public forgotPassword = async (email: string): Promise<string|undefined> => {
    const { token, user } = await AuthService.forgotPassword(email)
    if (token) {
      return await EmailService.build({
        to: email,
        subject: AuthResponses.nodemailer.subject,
        template: 'forgotPassword'
      }, {
        name: user.name,
        url: `${config.forgotPass.url}/reset-password/${token}`
      })
    }
  }
}

export default new AuthController()
