import { Repository, EntityRepository, MoreThanOrEqual } from 'typeorm'
import { Email } from '../../../database/entities/Email'

@EntityRepository(Email)
export class EmailRepository extends Repository<Email> {
  public get = async (email: string) =>
    await this.manager.getRepository(Email).findOne({ email })

  public updateEmail = async (email: Email, updates: any) =>
    await this.manager.getRepository(Email).merge(email, updates)

  public getEmailWithCode = async (email: string, code: number) =>
    await this.manager.getRepository(Email).findOne({
      email,
      code,
      expire: MoreThanOrEqual(new Date())
    })

  public deleteByEmail = async (email: string) =>
    await this.manager.getRepository(Email).delete({ email })
}
