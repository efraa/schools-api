import { UserDTO } from '../../../src/application/user/user.providers'

export interface IBulkLoadJob {
  file: string,
  userLogged: UserDTO,
}

export interface IUser {
  name: string,
  lastname: string,
  username: string,
  email: string,
  password: string,
  role: string,
  codeSchool: string,
  isActive: boolean
}
