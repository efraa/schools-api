import { SchoolService, SchoolDTO } from '../providers/SchoolProvider'
import { User } from '../../../database/entities/User'

export class SchoolController {
  constructor(private _SchoolService: SchoolService) {}

  public async create(user: User): Promise<SchoolDTO> {
    const school = await this._SchoolService.mapToEntity({ user })
    return await this._SchoolService.create(school)
  }
}
