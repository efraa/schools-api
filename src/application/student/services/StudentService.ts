import { StudentRepository, StudentMapper } from '../providers/StudentProvider'
import { Student } from 'src/database/entities/Student'
import { UserMapper } from '../../user/providers/UserProvider'
import { User } from '../../../database/entities/User'

export class StudentService {
  constructor(
    private _StudentRepository: StudentRepository,
    private _StudentMapper: StudentMapper,
    private _UserMapper: UserMapper,
  ) {}

  public mapToEntity = async (studentPayload: any): Promise<Student> =>
    await this._StudentMapper.mapToEntity(studentPayload)

  public getByUserId = async (userId: number) =>
    await this._StudentRepository.getByUserId(userId)

  public create = async (userEntity: Student) =>
    await this._StudentRepository.save(userEntity).then(student => {
      const user = this._UserMapper.mapToDTO(student.user)
      return this._StudentMapper.mapToDTO({ ...student, user: user as User })
    })
}
