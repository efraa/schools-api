import { getRepository, Repository } from 'typeorm'
import Connection from '@database/DatabaseConnection'

// Entity
import { User } from '@app/user/user.providers'

class AuthRepository {
  private _User: Repository<User>

  constructor() {
    this.manager(getRepository)
  }

  private manager = async (repo: any) => {
    await Connection.connect()
    this._User = repo(User)
  }

  public create = async (user: User): Promise<User> =>
    await this._User.create(user)

  public save = async (user: User): Promise<User> =>
    await this._User.save(user)
}

export default new AuthRepository()
