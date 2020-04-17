import { Mapper } from 'ts-simple-automapper'
import { SchoolDTO, SchoolRepository } from '../../providers/SchoolProvider'
import { School } from '../../../../database/entities/School'

export class SchoolMapper {
  constructor(private _SchoolRepository: SchoolRepository) {}

  public mapToDTO(from: School): SchoolDTO {
    const schoolDTO: SchoolDTO = new Mapper().map(from, new SchoolDTO())
    return schoolDTO
  }

  public mapToEntity = async (from: any): Promise<School> =>
    await this._SchoolRepository.create(from as School)

  public mapListToDTO(schools: School[]): SchoolDTO[] {
    return schools.map(school => this.mapToDTO(school))
  }
}
