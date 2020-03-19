import { StudentService, StudentResponses } from '../providers/StudentProvider'
import { UserDTO, UserService, UserResponses, UserStatus } from '../../user/providers/UserProvider'
import { ErrorHandler, statusCodes } from '../../../infrastructure/routes'

export class StudentController {
  constructor(
    private _StudentService: StudentService,
    private _UserService: UserService,
  ) {}

  public async create(userLogged: UserDTO, studentPayload: any) {}
}
