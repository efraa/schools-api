import { TeacherRepository, TeacherMapper } from '../providers/TeacherProvider'
import { Teacher } from 'src/database/entities/Teacher'
import { UserMapper } from '../../user/providers/UserProvider'
import { User } from '../../../database/entities/User'

export class TeacherService {
  constructor(
    private _TeacherRepository: TeacherRepository,
    private _TeacherMapper: TeacherMapper,
    private _UserMapper: UserMapper,
  ) {}

  public mapToEntity = async (teacherPayload: any): Promise<Teacher> =>
    await this._TeacherMapper.mapToEntity(teacherPayload)

  public getByUserId = async (userId: number) =>
    await this._TeacherRepository.getByUserId(userId)

  public create = async (userEntity: Teacher) =>
    await this._TeacherRepository.save(userEntity).then(teacher => {
      const user = this._UserMapper.mapToDTO(teacher.user)
      return this._TeacherMapper.mapToDTO({ ...teacher, user: user as User })
    })
}
