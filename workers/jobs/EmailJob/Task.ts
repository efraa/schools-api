import EmailService from '../../services/EmailService'

export const EmailTask = {
  key: 'SEND_EMAIL_JOB',
  async handle({ data: { email } }) {
    await EmailService.build({
      to: email.to,
      subject: email.subject,
      template: email.template,
    }, email.data)
  },
}
