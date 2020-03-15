import { getConnection  } from 'typeorm'
import { UserRepository, UserController, UserService, UserMapper } from '../providers/UserProvider'
import { SessionRepository, SessionService, SessionMapper } from '../providers/SessionProvider'
import { EmailRepository, EmailService, EmailMapper } from '../providers/EmailProvider'

export class UserModule {
  // Repositories
  static getUserRepository = () =>
    getConnection().createEntityManager().getCustomRepository(UserRepository)

  static getSessionRepository = () =>
    getConnection().createEntityManager().getCustomRepository(SessionRepository)

  static getEmailRepository = () =>
    getConnection().createEntityManager().getCustomRepository(EmailRepository)

  // Mappers
  static getUserMapper(): UserMapper {
    return new UserMapper(this.getUserRepository())
  }

  static getSessionMapper(): SessionMapper {
    return new SessionMapper(this.getSessionRepository())
  }

  static getEmailMapper(): EmailMapper {
    return new EmailMapper(this.getEmailRepository())
  }

  // Services
  static getUserService(): UserService {
    return new UserService(this.getUserRepository(), this.getUserMapper())
  }

  static getSessionService(): SessionService {
    return new SessionService(this.getSessionRepository(), this.getSessionMapper(), this.getUserMapper())
  }

  static getEmailService(): EmailService {
    return new EmailService(this.getEmailRepository(), this.getEmailMapper())
  }

  // Controllers
  static getUserController() {
    return new UserController(this.getUserService(), this.getSessionService(), this.getEmailService())
  }
}
