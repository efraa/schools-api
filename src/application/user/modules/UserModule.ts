import { getConnection  } from 'typeorm'
import { UserRepository, UserController, UserService, UserMapper } from '../providers/UserProvider'
import { SessionRepository, SessionService, SessionMapper } from '../providers/SessionProvider'

export class UserModule {
  // Repositories
  static getUserRepository = () =>
    getConnection().createEntityManager().getCustomRepository(UserRepository)

  static getSessionRepository = () =>
    getConnection().createEntityManager().getCustomRepository(SessionRepository)

  // Mappers
  static getUserMapper(): UserMapper {
    return new UserMapper(this.getUserRepository())
  }

  static getSessionMapper(): SessionMapper {
    return new SessionMapper(this.getSessionRepository())
  }

  // Services
  static getUserService(): UserService {
    return new UserService(this.getUserRepository(), this.getUserMapper())
  }

  static getSessionService(): SessionService {
    return new SessionService(this.getSessionRepository(), this.getSessionMapper(), this.getUserMapper())
  }

  // Controllers
  static getUserController() {
    return new UserController(this.getUserService(), this.getSessionService())
  }
}
