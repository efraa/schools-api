import { getConnection  } from 'typeorm'
import { UserRepository, UserController, UserService, UserMapper } from '../providers/UserProvider'

export class UserModule {
  // Repositories
  static getUserRepository = () =>
    getConnection().createEntityManager().getCustomRepository(UserRepository)

  // Mappers
  static getUserMapper(): UserMapper {
    return new UserMapper(this.getUserRepository())
  }

  // Services
  static getUserService(): UserService {
    return new UserService(this.getUserRepository(), this.getUserMapper())
  }

  // Controllers
  static getUserController() {
    return new UserController(this.getUserService())
  }
}
