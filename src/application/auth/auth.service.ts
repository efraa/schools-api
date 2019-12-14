import { UserDTO, UserMapper } from '@app/user/user.providers'
import { AuthRepository } from './auth.providers'

class AuthService {
  public signup = async (userPayload: any): Promise<UserDTO> => {
    const user = await UserMapper.mapToEntity(userPayload)
    console.log(user)
    return await AuthRepository.save(user)
  }
}

export default new AuthService()
