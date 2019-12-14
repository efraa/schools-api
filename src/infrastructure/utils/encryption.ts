import bcrypt from 'bcrypt'

const encryptPassword = (pass: string) => bcrypt.hashSync(pass, 10)
const comparePassword = (pass: string, encodedPass: string) => bcrypt.compareSync(pass, encodedPass)

export {
  encryptPassword,
  comparePassword
}
