import { getRepository, Repository } from 'typeorm'

// Entity
import { User } from '@app/user/user.providers'

export class AuthRepository {
  private _User: Repository<User> = getRepository(User)

  public signup = async (user: User): Promise<User> =>
    await this._User.create(user)

  public getByEmail = async (email: string): Promise<User|undefined> =>
    await this._User.findOne({ email })

  public getByUsername = async (username: string): Promise<User|undefined> =>
    await this._User.findOne({ username })

  public save = async (user: User): Promise<User> =>
    await this._User.save(user)
}
