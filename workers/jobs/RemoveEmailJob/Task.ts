import { userModule } from '../../../src/application/user/modules/UserModule'
import { DatabaseConnection } from '../../../src/database/DatabaseConnection'

export const RemoveEmailTask = {
  key: 'REMOVE_EMAIL_JOB',
  async handle({ data }) {
    await DatabaseConnection.connect().then(async () =>
      await userModule.emailService.delete(data.email))
  }
}
