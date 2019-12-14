import { UserDTO } from '@app/user/user.providers'

class AuthService {
  public signup = async (userPayload: any): Promise<UserDTO> => {
    return {} as any
  }
}

export default new AuthService()
