import { StudentRepository, StudentMapper, StudentResponses } from '../providers/StudentProvider'
import { Student } from '../../../database/entities/Student'
import { UserMapper, UserDTO } from '../../user/providers/UserProvider'
import { User } from '../../../database/entities/User'
import { FindManyOptions } from 'typeorm'
import { SchoolMapper, SchoolService } from '../../../application/school/providers/SchoolProvider'
import { School } from '../../../database/entities/School'
import { ErrorHandler, statusCodes } from '../../../infrastructure/routes'

export class StudentService {
  constructor(
    private _StudentRepository: StudentRepository,
    private _StudentMapper: StudentMapper,
    private _UserMapper: UserMapper,
    private _SchoolMapper: SchoolMapper,
    private _SchoolService: SchoolService,
  ) {}

  public mapToEntity = async (studentPayload: any): Promise<Student> =>
    await this._StudentMapper.mapToEntity(studentPayload)

  public getByUserId = async (userId: number) =>
    await this._StudentRepository.getByUserId(userId)

  public count = async (query: FindManyOptions<Student> = {}) => await this._StudentRepository.count(query)

  public create = async (userEntity: Student) =>
    await this._StudentRepository.save(userEntity).then(student => {
      const user = this._UserMapper.mapToDTO(student.user)
      const school = this._SchoolMapper.mapToDTO(student.school)
      return this._StudentMapper.mapToDTO({
        ...student,
        user: user as any,
        school: school as School
      })
    })

  public async list(query: {
    page?: number,
    perPage?: number,
    name?: string,
    lastname?: string,
    userLogged: UserDTO
  }) {
    let { page, perPage, name, lastname, userLogged } = query
    page = page || 1
    perPage = perPage || 25

    const school = await this._SchoolService.getByUserId(userLogged.id)
    if (school) {
      const students: any = await this._StudentRepository.list({
        page,
        perPage,
        schoolId: school.id,
        name,
        lastname,
      })

      if (!students.rows[0])
        throw ErrorHandler.build(statusCodes.NOT_FOUND, StudentResponses.NO_STUDENT_DATA)

      return {
        students: this._StudentMapper.mapListToDTO(students.rows),
        allStudents: students.allStudents,
        pages: students.pages
      }
    }
  }
}
