import { Repository, EntityRepository } from 'typeorm'
import { Session } from '../../../database/entities/Session'

@EntityRepository(Session)
export class SessionRepository extends Repository<Session> {
  public getSessionByUserId = async (userId: number): Promise<Session|undefined> =>
    await this.manager.getRepository(Session).findOne({ userId })
}
