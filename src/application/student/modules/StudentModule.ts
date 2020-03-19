import { getCustomRepository  } from 'typeorm'
import { userModule } from '../../user/modules/UserModule'
import { StudentRepository, StudentController, StudentService, StudentMapper } from '../providers/StudentProvider'

export class StudentModule {
  private _studentRepository: StudentRepository
  private _studentMapper: StudentMapper
  private _studentService: StudentService
  private _studentController: StudentController

  get studentRepository(): StudentRepository {
    return !this._studentRepository ?
      (this._studentRepository = getCustomRepository(StudentRepository))
    : this._studentRepository
  }

  get studentMapper(): StudentMapper {
    return !this._studentMapper ?
      (this._studentMapper = new StudentMapper(this.studentRepository))
      : this._studentMapper
  }

  get studentService(): StudentService {
    return !this._studentService ?
      (this._studentService = new StudentService(this.studentRepository, this.studentMapper, userModule.userMapper))
      : this._studentService
  }

  get controller(): StudentController {
    return !this._studentController ?
      (this._studentController = new StudentController(this.studentService, userModule.userService))
      : this._studentController
  }
}

export const studentModule = new StudentModule()
