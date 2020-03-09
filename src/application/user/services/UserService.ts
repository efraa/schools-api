import { UserDTO, UserRepository, UserMapper, UserResponses } from '../providers/UserProvider'
import { User } from 'src/database/entities/User'
import { UserPayload } from '../utils/UserPayload'
import { ErrorHandler, statusCodes } from '../../../infrastructure/routes'
import crypto from 'crypto'

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

  public async create(userEntity: User): Promise<User> {
    let user = await this._UserRepository.save(userEntity)
    user.generateCodeSchool(user.uuid)
    user = await this._UserRepository.save(user)

    return user
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

  public async login(emailOrUsername: string, password: string): Promise<User> {
    const emailExists = await this._UserRepository.getByEmail(emailOrUsername)
    const usernameExists = await this._UserRepository.getByUsername(emailOrUsername)
    const user = emailExists || usernameExists

    if (user && user.id) {
      if (!user.isActive())
        throw ErrorHandler.build(statusCodes.UNAUTHORIZED, `${UserResponses.STATUS} ${user.status}`)

      const matchPassword = await user.comparePassword(password)
      if (!matchPassword)
        throw ErrorHandler.build(statusCodes.BAD_REQUEST, UserResponses.BAD_CREDENTIALS)

      return user
    }

    throw ErrorHandler.build(statusCodes.BAD_REQUEST, UserResponses.ACCOUNT_NOT_FOUND)
  }

  public async forgotPassword(email: string): Promise<{
    token: string,
    user: User|undefined
  }> {
    const user = await this._UserRepository.getByEmail(email)
    if (!user)
      throw ErrorHandler.build(statusCodes.NOT_FOUND, UserResponses.ACCOUNT_NOT_FOUND)

    // Generate token
    const token: string = crypto.randomBytes(20).toString('hex')
    const forgotToken = crypto.createHash('sha256').update(token).digest('hex')
    const expireDate = new Date()
    // Increase 60 minutes to the current time
    expireDate.setMinutes(expireDate.getMinutes() + 60)
    const updated = await this._UserRepository.updateUser(user, {
      forgotToken, forgotExpire: expireDate
    })
    if (updated)
      await this._UserRepository.save(updated)

    return {
      token: forgotToken,
      user: updated
    }
  }

  public checkPasswordExpire = async (token: string): Promise<User> => {
    const user = await this._UserRepository.getByForgotToken(token)
    if (!user)
      throw ErrorHandler.build(statusCodes.BAD_REQUEST, UserResponses.USER_NOT_FOUND)

    return user
  }

  public async resetPassword(token: string, password: string) {
    const user = await this.checkPasswordExpire(token)
    const updated = await this._UserRepository.updateUser(user, {
      forgotToken: null,
      forgotExpire: null,
      password: user.encryptPassword(password)
    })
    if (updated)
      await this._UserRepository.save(updated)

    return UserResponses.FORGOT_PASS_CHANGED
  }
}
