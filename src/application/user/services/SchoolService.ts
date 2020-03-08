import { SchoolRepository, SchoolMapper, SchoolDTO } from '../providers/SchoolProvider'
import { School } from '../../../database/entities/School'
import { User } from '../../../database/entities/User'

export class SchoolService {
  constructor(
    private _SchoolRepository: SchoolRepository,
    private _SchoolMapper: SchoolMapper,
  ) {}

  public mapToEntity = async (userPayload: { user: User }): Promise<School> =>
   await this._SchoolMapper.mapToEntity(userPayload)

  public async create(schoolEntity: School): Promise<SchoolDTO> {
    const school = await this._SchoolRepository.save(schoolEntity)
    return this._SchoolMapper.mapToDTO(school)
  }

  public async getSchoolByUserId(userId: number): Promise<SchoolDTO|undefined> {
    const school = await this._SchoolRepository.getSchoolByUserId(userId)
    if (school)
      return this._SchoolMapper.mapToDTO(school)
  }
}
