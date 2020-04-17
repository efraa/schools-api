import { getCustomRepository  } from 'typeorm'
import { userModule } from '../../user/modules/UserModule'
import { TeacherRepository, TeacherController, TeacherService, TeacherMapper } from '../providers/TeacherProvider'

export class TeacherModule {
  private _teacherRepository: TeacherRepository
  private _teacherMapper: TeacherMapper
  private _teacherService: TeacherService
  private _teacherController: TeacherController

  get teacherRepository(): TeacherRepository {
    return !this._teacherRepository ?
      (this._teacherRepository = getCustomRepository(TeacherRepository))
    : this._teacherRepository
  }

  get teacherMapper(): TeacherMapper {
    return !this._teacherMapper ?
      (this._teacherMapper = new TeacherMapper(this.teacherRepository))
      : this._teacherMapper
  }

  get teacherService(): TeacherService {
    return !this._teacherService ?
      (this._teacherService = new TeacherService(this.teacherRepository, this.teacherMapper, userModule.userMapper))
      : this._teacherService
  }

  get controller(): TeacherController {
    return !this._teacherController ?
      (this._teacherController = new TeacherController(this.teacherService, userModule.userService))
      : this._teacherController
  }
}

export const teacherModule = new TeacherModule()
