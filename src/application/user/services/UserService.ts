import { UserDTO, UserRepository, UserMapper, UserResponses, Roles } from '../providers/UserProvider'
import { User } from 'src/database/entities/User'
import { ErrorHandler, statusCodes } from '../../../infrastructure/routes'
import crypto from 'crypto'
import { cloud, deleteUploadedFiles } from '../../../infrastructure/utils'
import { SchoolMapper } from '../../../application/school/providers/SchoolProvider'
import { School } from '../../../database/entities/School'

export class UserService {
  constructor(
    private _UserRepository: UserRepository,
    private _UserMapper: UserMapper,
    private _SchoolMapper: SchoolMapper,
  ) {}

  public mapToEntity = async (userPayload: UserPayload): Promise<User> =>
   await this._UserMapper.mapToEntity(userPayload)

  public async getUserByEmail(email: string): Promise<UserDTO|undefined> {
    const user = await this._UserRepository.getByEmail(email)
    if (user)
      return this._UserMapper.mapToDTO(user)
  }

  public getUserById = async (id: number) =>
    await this._UserRepository.getById(id)

  public getUserByUsername = async (username: string) =>
    await this._UserRepository.getByUsername(username).then(user =>
      this._UserMapper.mapToDTO(user as User))

  public create = async (userEntity: User) =>
    await this._UserRepository.save(userEntity).then(user =>
      this._UserMapper.mapToDTO(user))

  public getUserWithAccountInfo = async (userId: number) =>
    await this._UserRepository.getUserWithAccountInfo(userId).then(user => {
      const account = user?.role === Roles.SCHOOL ?
        this._SchoolMapper.mapToDTO(user?.school as School) : null

      return this._UserMapper.mapToDTO({ ...user, account } as User)
    })

  public async update(user: User, update: {}) {
    const updated = await this._UserRepository.updateUser(user, update)
    return await this._UserRepository.save(updated as User)
  }

  public async login(emailOrUsername: string, password: string): Promise<UserDTO> {
    const user = await this._UserRepository.getByEmailOrUsername(emailOrUsername)
    if (user && user.id) {
      if (!user.isActive())
        throw ErrorHandler.build(statusCodes.UNAUTHORIZED, `${UserResponses.STATUS} ${user.status}`)

      const matchPassword = await user.comparePassword(password)
      if (!matchPassword)
        throw ErrorHandler.build(statusCodes.UNAUTHORIZED, UserResponses.BAD_CREDENTIALS)

      return this._UserMapper.mapToDTO(user)
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

  public async upload(user: User, picture: { path: string, name: string }) {
    if (user) {
      const uploaded = await cloud.upload(picture.path, {
        folder: 'users',
        width: 200,
        crop: 'limit',
        format: 'jpg'
      })

      if (user.picture && user.picture.id)
        await cloud.destroy(user.picture.id)

      const updatePicture = await this._UserRepository.updateUser(user, {
        picture: {
          url: uploaded.secure_url,
          id: uploaded.public_id
        }
      })
      if (updatePicture) {
        await this._UserRepository.save(updatePicture)
        await deleteUploadedFiles(picture.name)

        return {
          picture: updatePicture.picture
        }
      }
    }

    await deleteUploadedFiles(picture.name)
    throw ErrorHandler.build(statusCodes.NOT_FOUND, UserResponses.USER_NOT_FOUND)
  }
}
