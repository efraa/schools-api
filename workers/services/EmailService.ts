import { Logger } from '../../src/infrastructure/utils/logging/Logger'
import sgMail from '@sendgrid/mail'
import handlebars from 'handlebars'
import fs from 'fs'

class EmailService {
  constructor () {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY as string)
  }

  public async build(email: {
    to: string,
    subject: string,
    template: string
  }, data: {}) {
    try {
      const { to, subject, template } = email
      const templateFile = fs.readFileSync(`src/templates/${template}.html`, 'utf-8')
      const html = handlebars.compile(templateFile)(data)
      const message = {
        from: process.env.EMAIL_FROM as string,
        to,
        subject,
        html,
      }

      return await sgMail.send(message)
    } catch (err) {
      Logger.error(`[EMAIL SERVICE]: ${err.mesagge}`)
    }
  }
}

export default new EmailService()
