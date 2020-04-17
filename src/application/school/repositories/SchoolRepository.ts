import { Repository, EntityRepository, FindManyOptions } from 'typeorm'
import { School } from '../../../database/entities/School'

@EntityRepository(School)
export class SchoolRepository extends Repository<School> {
  public getByUserId = async (userId: number): Promise<School|undefined> =>
    await this.manager.getRepository(School).findOne({ userId })

  public updateSchool = async (school: School, updates: any): Promise<School|undefined> =>
    await this.manager.getRepository(School).merge(school, updates)

  public getAll = async (query: FindManyOptions<School> = {}): Promise<School[]> =>
    await this.manager.getRepository(School).find(query)
}
