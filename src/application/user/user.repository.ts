import { getRepository, Connection, Repository } from 'typeorm'

// Entity
import { User } from './user.providers'

export class UserRepository {
  private _User: Repository<User>

  constructor(
    private DatabaseConnection: Connection
  ) {
    this.getUserRepository()
  }

  private async getUserRepository() {
    await this.DatabaseConnection.connect()
    this._User = getRepository(User)
    return this._User
  }

  public getUserByUsername = async (username: string): Promise<User|undefined> =>
    await this._User.findOne({ username })
}
