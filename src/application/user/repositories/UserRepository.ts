import { Repository, EntityRepository, FindManyOptions, MoreThanOrEqual } from 'typeorm'
import { User } from '../../../database/entities/User'

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  public getById = async (id: number): Promise<User|undefined> =>
    await this.manager.getRepository(User).findOne({ id })

  public getByUsername = async (username: string): Promise<User|undefined> =>
    await this.manager.getRepository(User).findOne({ username })

  public getByEmail = async (email: string): Promise<User|undefined> =>
    await this.manager.getRepository(User).findOne({ email })

  public updateUser = async (user: User, updates: any): Promise<User|undefined> =>
    await this.manager.getRepository(User).merge(user, updates)

  public getAll = async (query: FindManyOptions<User> = {}): Promise<User[]> =>
    await this.manager.getRepository(User).find(query)

  public delete = async (id: number) =>
    await this.manager.getRepository(User).delete({ id })

  public getByForgotToken = async (token: string): Promise<User|undefined> =>
    await this.manager.getRepository(User).findOne({
      forgotToken: token,
      forgotExpire: MoreThanOrEqual(new Date())
    })

  public getByEmailOrUsername = async (term: string): Promise<User|undefined> =>
    await this.manager.getRepository(User).createQueryBuilder('user')
      .where('user.email = :email', { email: term })
      .orWhere('user.username = :username', { username: term })
      .getOne()
}
