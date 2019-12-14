import { Mapper } from 'ts-simple-automapper'
import { User, UserDTO } from '../user.providers'
import { AuthRepository } from '@app/auth/auth.providers'

class UserMapper {
  public mapToDTO(from: any): UserDTO {
    const userDTO: UserDTO = new Mapper().map(from, new UserDTO())
    return userDTO
  }

  public mapToEntity = async (from: any): Promise<User> =>
    await AuthRepository.create(from)

  public mapListToDTO(users: User[]): UserDTO[] {
    return users.map(user => this.mapToDTO(user))
  }
}

export default new UserMapper()
