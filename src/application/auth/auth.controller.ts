import { AuthService } from '@app/auth/auth.providers'
import { UserDTO } from '@app/user/user.providers'

export class AuthController {
  /**
  * @description Sign up
  * @param {any} user
  * @returns {Promise<UserDTO>}
  */
  public signup = async (user: any): Promise<UserDTO> =>
    await AuthService.signup(user)
}

export default new AuthController()
