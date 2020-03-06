import csv from 'csv-parser'
import fs from 'fs'
import { IUser } from '../IBulkLoadJob'
import { UserDTO } from '../../../../src/application/user/user.providers'

export const perUserInFile = async (file: string, userLogged: UserDTO, cb: Function) => {
  const users: { body: IUser }[] = []

  await fs.createReadStream(file)
    .pipe(csv())
    .on('data', data => users.push({
      body: {
        ...data,
        codeSchool: userLogged.codeSchool,
        isActive: true
      }
    }))
    .on('end', () => users.map(async user => await cb(user)))
}
