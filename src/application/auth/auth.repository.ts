import { getRepository, Repository, MoreThanOrEqual } from 'typeorm'
import { DatabaseConnection } from '../../database/DatabaseConnection'

import { User } from '../user/user.providers'
import { Roles } from '../../infrastructure/utils/roles'

class AuthRepository {
  private _User: Repository<User>

  constructor() {
    this.manager(getRepository)
  }

  private manager = async (repo: any) => {
    await DatabaseConnection.connect()
    this._User = repo(User)
  }

  public create = async (user: User): Promise<User> =>
    await this._User.create(user)

  public save = async (user: User): Promise<User> =>
    await this._User.save(user)

  public getByEmail = async (email: string): Promise<User|undefined> =>
    await this._User.findOne({ email })

  public getByUsername = async (username: string): Promise<User|undefined> =>
    await this._User.findOne({ username })

  public findSchool = async (codeSchool: string): Promise<User|undefined> =>
    await this._User.findOne({
      codeSchool,
      role: Roles.School
    })

  public update = async (user: User, update: {}): Promise<User> =>
    await this._User.merge(user, update)

  public schoolMembers = async (codeSchool: string): Promise<{
    teachers: number,
    students: number
  }> => {
    const teachers = await this._User.count({
      codeSchool,
      role: Roles.Teacher
    })
    const students = await this._User.count({
      codeSchool,
      role: Roles.Student
    })

    return {
      teachers,
      students
    }
  }

  public getByForgotPasswordToken = async (token: string): Promise<User|undefined> =>
    await this._User.findOne({
      forgotPasswordToken: token,
      forgotPasswordExpire: MoreThanOrEqual(new Date())
    })
}

export default new AuthRepository()
