import { getCustomRepository  } from 'typeorm'
import { userModule } from '../../user/modules/UserModule'
import { schoolModule } from '../../school/modules/SchoolModule'
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
      (this._studentMapper = new StudentMapper(this.studentRepository, userModule.userMapper))
      : this._studentMapper
  }

  get studentService(): StudentService {
    return !this._studentService ?
      (this._studentService = new StudentService(
        this.studentRepository,
        this.studentMapper,
        userModule.userMapper,
        schoolModule.schoolMapper,
        schoolModule.schoolService,
      ))
      : this._studentService
  }

  get controller(): StudentController {
    return !this._studentController ?
      (this._studentController = new StudentController(
        this.studentService,
        userModule.userService,
        schoolModule.schoolService
      )) : this._studentController
  }
}

export const studentModule = new StudentModule()
