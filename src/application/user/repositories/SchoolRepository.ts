import { Repository, EntityRepository } from 'typeorm'
import { School } from '../../../database/entities/School'

@EntityRepository(School)
export class SchoolRepository extends Repository<School> {
  public getSchoolByUserId = async (userId: number): Promise<School|undefined> =>
    await this.manager.getRepository(School).findOne({ userId })
}
