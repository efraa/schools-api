import { getConnection  } from 'typeorm'
import { UserRepository, UserController, UserService, UserMapper } from '../providers/UserProvider'
import { EmailRepository, EmailService, EmailMapper } from '../providers/EmailProvider'

export class UserModule {
  // Repositories
  private _userRepository: UserRepository
  private _emailRepository: EmailRepository

  // Mappers
  private _userMapper: UserMapper
  private _emailMapper: EmailMapper

  // Services
  private _userService: UserService
  private _emailService: EmailService

  // Controllers
  private _userController: UserController

  get userRepository(): UserRepository {
    return !this._userRepository ?
      (this._userRepository = getConnection().createEntityManager()
        .getCustomRepository(UserRepository))
    : this._userRepository
  }

  get emailRepository(): EmailRepository {
    return !this._emailRepository ?
      (this._emailRepository = getConnection().createEntityManager()
        .getCustomRepository(EmailRepository))
    : this._emailRepository
  }

  get userMapper(): UserMapper {
    return !this._userMapper ?
      (this._userMapper = new UserMapper(this.userRepository))
      : this._userMapper
  }

  get emailMapper(): EmailMapper {
    return !this._emailMapper ?
      (this._emailMapper = new EmailMapper(this.emailRepository))
      : this._emailMapper
  }

  get userService(): UserService {
    return !this._userService ?
      (this._userService = new UserService(this.userRepository, this.userMapper))
      : this._userService
  }

  get emailService(): EmailService {
    return !this._emailService ?
      (this._emailService = new EmailService(
        this.emailRepository,
        this.emailMapper,
        this.userService
      )) : this._emailService
  }

  get controller(): UserController {
    return !this._userController ?
      (this._userController = new UserController(this.userService, this.emailService))
      : this._userController
  }
}

export const userModule = new UserModule()
