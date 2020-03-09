import { Mapper } from 'ts-simple-automapper'
import { UserDTO, UserRepository } from '../../providers/UserProvider'
import { User } from '../../../../database/entities/User'

export class UserMapper {
  constructor(private _UserRepository: UserRepository) {}

  public mapToDTO(from: User): UserDTO {
    const userDTO: UserDTO = new Mapper().map(from, new UserDTO())
    return userDTO
  }

  public mapToEntity = async (from: UserPayload): Promise<User> =>
    await this._UserRepository.create(from as User)

  public mapListToDTO(users: User[]): UserDTO[] {
    return users.map(user => this.mapToDTO(user))
  }
}
