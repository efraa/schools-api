import { TeacherService, TeacherResponses } from '../providers/TeacherProvider'
import { UserDTO, UserService, UserResponses, UserStatus } from '../../user/providers/UserProvider'
import { ErrorHandler, statusCodes } from '../../../infrastructure/routes'

export class TeacherController {
  constructor(
    private _TeacherService: TeacherService,
    private _UserService: UserService,
  ) {}

  public async create(userLogged: UserDTO, teacherPayload: any) {}
}
