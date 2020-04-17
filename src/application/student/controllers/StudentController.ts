import { StudentService, StudentResponses } from '../providers/StudentProvider'
import { UserDTO, UserService, Roles, UserResponses } from '../../user/providers/UserProvider'
import { ErrorHandler, statusCodes } from '../../../infrastructure/routes'
import { SchoolService } from '../../../application/school/services/SchoolService'

export class StudentController {
  constructor(
    private _StudentService: StudentService,
    private _UserService: UserService,
    private _SchoolService: SchoolService,
  ) {}

  public async create(userLogged: UserDTO, studentPayload: any) {
    const school = await this._SchoolService.getByUserId(userLogged.id)
    if (!school)
      throw ErrorHandler.build(statusCodes.UNAUTHORIZED, StudentResponses.SCHOOL_NOT_FOUND)

    const user = await this._UserService.createSchoolMember(Roles.STUDENT, studentPayload.name)
    const student = await this._StudentService.mapToEntity({
      ...studentPayload,
      user,
      school
    })

    return await this._StudentService.create(student)
  }

  public async list(query: {
    userLogged: UserDTO,
    perPage?: number,
    page?: number,
    name?: string,
    lastname?: string
  }) {
    if (query.userLogged.role === Roles.SCHOOL)
      return await this._StudentService.list(query)

    throw ErrorHandler.build(statusCodes.UNAUTHORIZED, UserResponses.UNAUTHORIZED)
  }
}
