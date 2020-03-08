import { getConnection  } from 'typeorm'
import { UserRepository, UserController, UserService, UserMapper } from '../providers/UserProvider'
import { SchoolRepository, SchoolController, SchoolService, SchoolMapper } from '../providers/SchoolProvider'
import { SessionRepository, SessionService, SessionMapper } from '../providers/SessionProvider'

export class UserModule {
  // Repositories
  static getUserRepository = () =>
    getConnection().createEntityManager().getCustomRepository(UserRepository)

  static getSchoolRepository = () =>
    getConnection().createEntityManager().getCustomRepository(SchoolRepository)

  static getSessionRepository = () =>
    getConnection().createEntityManager().getCustomRepository(SessionRepository)


  // Mappers
  static getUserMapper(): UserMapper {
    return new UserMapper(this.getUserRepository())
  }

  static getSchoolMapper(): SchoolMapper {
    return new SchoolMapper(this.getSchoolRepository())
  }

  static getSessionMapper(): SessionMapper {
    return new SessionMapper(this.getSessionRepository())
  }

  // Services
  static getUserService(): UserService {
    return new UserService(this.getUserRepository(), this.getUserMapper())
  }

  static getSchoolService(): SchoolService {
    return new SchoolService(this.getSchoolRepository(), this.getSchoolMapper())
  }

  static getSessionService(): SessionService {
    return new SessionService(this.getSessionRepository(), this.getSessionMapper(), this.getUserMapper())
  }

  // Controllers
  static getUserController() {
    return new UserController(this.getUserService(), this.getSessionService(), this.getSchoolController())
  }

  static getSchoolController() {
    return new SchoolController(this.getSchoolService())
  }
}
