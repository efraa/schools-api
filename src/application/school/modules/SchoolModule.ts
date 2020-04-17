import { getCustomRepository  } from 'typeorm'
import { userModule } from '../../user/modules/UserModule'
import { SchoolRepository, SchoolController, SchoolService, SchoolMapper } from '../providers/SchoolProvider'

export class SchoolModule {
  private _schoolRepository: SchoolRepository
  private _schoolMapper: SchoolMapper
  private _schoolService: SchoolService
  private _schoolController: SchoolController

  get schoolRepository(): SchoolRepository {
    return !this._schoolRepository ?
      (this._schoolRepository = getCustomRepository(SchoolRepository))
    : this._schoolRepository
  }

  get schoolMapper(): SchoolMapper {
    return !this._schoolMapper ?
      (this._schoolMapper = new SchoolMapper(this.schoolRepository))
      : this._schoolMapper
  }

  get schoolService(): SchoolService {
    return !this._schoolService ?
      (this._schoolService = new SchoolService(this.schoolRepository, this.schoolMapper, userModule.userMapper))
      : this._schoolService
  }

  get controller(): SchoolController {
    return !this._schoolController ?
      (this._schoolController = new SchoolController(this.schoolService, userModule.userService))
      : this._schoolController
  }
}

export const schoolModule = new SchoolModule()
