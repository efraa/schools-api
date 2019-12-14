import fs from 'fs'
import path from 'path'

export const getCommonPassword = (fileName = 'commonPasswords.txt') => {
  const passwordsPath = path.resolve(__dirname, fileName)
  if (fs.existsSync(passwordsPath)) {
    const list: string[] = []
    const passwords = fs.readFileSync(passwordsPath, 'utf8').split('\n')
    passwords.map(password => list.push(password.trim()))
    return list
  } else console.info('file not found.')
}
