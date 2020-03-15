import { Repository, EntityRepository } from 'typeorm'
import { Email } from '../../../database/entities/Email'

@EntityRepository(Email)
export class EmailRepository extends Repository<Email> {
  public get = async (email: string): Promise<Email|undefined> =>
    await this.manager.getRepository(Email).findOne({ email })

  public updateEmail = async (email: Email, updates: any): Promise<Email|undefined> =>
    await this.manager.getRepository(Email).merge(email, updates)
}
