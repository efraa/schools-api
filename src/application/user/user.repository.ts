import { getRepository, Repository, Like, Not, FindOperator } from 'typeorm'
import { DatabaseConnection } from '../../database/DatabaseConnection'

import { User } from './user.providers'
import { Roles } from '../../infrastructure/utils'

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

  public listOfMembers = async (query: {
    page: number,
    perPage: number,
    where: {}[]
  }): Promise<{
    rows: User[],
    allUsers: number,
    pages: number
  }> => {
    const { perPage, page, where } = query
    const [rows, count] = await this._User.findAndCount({
      skip: ((perPage * page) - perPage),
      take: perPage,
      where,
      order: {
        id: 'DESC'
      },
    })

    return {
      rows,
      allUsers: count,
      pages: Math.ceil(count / perPage),
    }
  }
}

export default new UserRepository()