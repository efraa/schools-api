import { getRepository, Repository } from 'typeorm'
import { DatabaseConnection } from '../../database/DatabaseConnection'

import { User } from './user.providers'

class UserRepository {
  private _User: Repository<User>

  constructor() {
    this.manager(getRepository)
  }

  private manager = async (repo: any) => {
    await DatabaseConnection.connect()
    this._User = repo(User)
  }

  public save = async (user: User): Promise<User> =>
    await this._User.save(user)

  public getByEmail = async (email: string): Promise<User|undefined> =>
    await this._User.findOne({ email })

  public getByUsername = async (query: { username: string, codeSchool: string }): Promise<User|undefined> =>
    await this._User.findOne(query)

  public update = async (user: User, update: {}): Promise<User> =>
    await this._User.merge(user, update)

}

export default new UserRepository()
