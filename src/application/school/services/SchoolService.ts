import { SchoolRepository, SchoolMapper } from '../providers/SchoolProvider'
import { School } from 'src/database/entities/School'
import { UserMapper } from '../../user/providers/UserProvider'
import { User } from '../../../database/entities/User'

export class SchoolService {
  constructor(
    private _SchoolRepository: SchoolRepository,
    private _SchoolMapper: SchoolMapper,
    private _UserMapper: UserMapper,
  ) {}

  public mapToEntity = async (schoolPayload: any): Promise<School> =>
    await this._SchoolMapper.mapToEntity(schoolPayload)

  public getByUserId = async (userId: number) =>
    await this._SchoolRepository.getByUserId(userId)

  public create = async (userEntity: School) =>
    await this._SchoolRepository.save(userEntity).then(school => {
      const user = this._UserMapper.mapToDTO(school.user)
      return this._SchoolMapper.mapToDTO({ ...school, user: user as any })
    })
}
