import { getConnection  } from 'typeorm'
import { UserRepository, UserController, UserService, UserMapper } from '../providers/UserProvider'
import { EmailRepository, EmailService, EmailMapper } from '../providers/EmailProvider'

export class UserModule {
  // Repositories
  private userRepository: UserRepository
  private emailRepository: EmailRepository

  getUserRepository(): UserRepository {
    return !this.userRepository ?
      (this.userRepository = getConnection().createEntityManager().getCustomRepository(UserRepository))
    : this.userRepository
  }

  getEmailRepository(): EmailRepository {
    return !this.emailRepository ?
      (this.emailRepository = getConnection().createEntityManager().getCustomRepository(EmailRepository))
    : this.emailRepository
  }

  // Mappers
  private userMapper: UserMapper
  private emailMapper: EmailMapper

  getUserMapper(): UserMapper {
    return !this.userMapper ?
      (this.userMapper = new UserMapper(this.getUserRepository()))
      : this.userMapper
  }

  getEmailMapper(): EmailMapper {
    return !this.emailMapper ?
      (this.emailMapper = new EmailMapper(this.getEmailRepository()))
      : this.emailMapper
  }

  // Services
  private userService: UserService
  private emailService: EmailService

  getUserService(): UserService {
    return !this.userService ?
      (this.userService = new UserService(this.getUserRepository(), this.getUserMapper()))
      : this.userService
  }

  getEmailService(): EmailService {
    return !this.emailService ?
      (this.emailService = new EmailService(this.getEmailRepository(), this.getEmailMapper(), this.getUserService()))
      : this.emailService
  }

  // Controllers
  getUserController() {
    return new UserController(this.getUserService(), this.getEmailService())
  }
}

export const userModule = new UserModule()
