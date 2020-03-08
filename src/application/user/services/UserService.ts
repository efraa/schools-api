import { UserDTO, UserRepository, UserMapper } from '../providers/UserProvider'
import { User } from 'src/database/entities/User'
import { UserPayload } from '../utils/UserPayload'

export class UserService {
  constructor(
    private _UserRepository: UserRepository,
    private _UserMapper: UserMapper,
  ) {}

  public mapToEntity = async (userPayload: UserPayload): Promise<User> =>
   await this._UserMapper.mapToEntity(userPayload)

  public async getUserByEmail(email: string): Promise<UserDTO|undefined> {
    const user = await this._UserRepository.getByEmail(email)
    if (user)
      return this._UserMapper.mapToDTO(user)
  }

  public async getUserByUsername(username: string): Promise<UserDTO|undefined> {
    const user = await this._UserRepository.getByUsername(username)
    if (user)
      return this._UserMapper.mapToDTO(user)
  }

  public async getUserByUsernameInSchool(username: string, codeSchool: string): Promise<UserDTO|undefined> {
    const user = await this._UserRepository.getByUsernameInSchool(username, codeSchool)
    if (user)
      return this._UserMapper.mapToDTO(user)
  }

  public async create(user: User): Promise<UserDTO> {
    let created = await this._UserRepository.save(user)
    created.generateCodeSchool(created.uuid)
    created = await this._UserRepository.save(created)
    return this._UserMapper.mapToDTO(created)
  }

  public async getUser(userId: number): Promise<UserDTO|undefined> {
    const user = await this._UserRepository.findOne({ id: userId })
    if (user)
      return this._UserMapper.mapToDTO(user)
  }

  public async getAll(query: object): Promise<UserDTO[]> {
    const users = await this._UserRepository.getAll(query)
    return this._UserMapper.mapListToDTO(users)
  }
}
