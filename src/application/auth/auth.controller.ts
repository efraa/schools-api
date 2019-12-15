import { AuthService } from '@app/auth/auth.providers'

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
}

export default new AuthController()
