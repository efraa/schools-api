import { AuthService } from '@app/auth/auth.providers'

export class AuthController {
  public signup = async (user: any): Promise<string> =>
    await AuthService.signup(user)
}

export default new AuthController()
