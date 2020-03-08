import { getConnection  } from 'typeorm'
import { UserRepository, UserController, UserService, UserMapper } from '../providers/UserProvider'
import { SchoolRepository, SchoolController, SchoolService, SchoolMapper } from '../providers/SchoolProvider'

export class UserModule {
  // Repositories
  static getUserRepository = () =>
    getConnection().createEntityManager().getCustomRepository(UserRepository)

  static getSchoolRepository = () =>
    getConnection().createEntityManager().getCustomRepository(SchoolRepository)


  // Mappers
  static getUserMapper(): UserMapper {
    return new UserMapper(this.getUserRepository())
  }

  static getSchoolMapper(): SchoolMapper {
    return new SchoolMapper(this.getSchoolRepository())
  }

  // Services
  static getUserService(): UserService {
    return new UserService(this.getUserRepository(), this.getUserMapper())
  }

  static getSchoolService(): SchoolService {
    return new SchoolService(this.getSchoolRepository(), this.getSchoolMapper())
  }

  // Controllers
  static getUserController() {
    return new UserController(this.getUserService(), this.getSchoolController())
  }

  static getSchoolController() {
    return new SchoolController(this.getSchoolService())
  }
}
