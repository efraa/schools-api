import { UserResponses } from '../providers/UserProvider'
import { EmailRepository, EmailMapper } from '../providers/EmailProvider'
import { Email } from '../../../database/entities/Email'
import { generateRandomCode } from '../providers/UserProvider'
import { ErrorHandler, statusCodes } from '../../../infrastructure/routes'

export class EmailService {
  constructor(
    private _EmailRepository: EmailRepository,
    private _EmailMapper: EmailMapper,
  ) {}

  public mapToEntity = async (emailPayload: any): Promise<Email> =>
   await this._EmailMapper.mapToEntity(emailPayload)

  public async create(emailString: string) {
    const expire = new Date()
    // Increase 24 Hours to the current time
    expire.setHours(expire.getHours() + 24)
    const email = await this.mapToEntity({
      email: emailString,
      expire,
    })

    return await this._EmailRepository.save(email)
  }

  public async generateEmailCodeAndUpdate(email: Email) {
    const updated = await this._EmailRepository.updateEmail(email, {
      code: generateRandomCode(),
      requestsAttempts: email.requestsAttempts += 1
    })
    if (updated)
      return await this._EmailRepository.save(updated)
  }

  public async getOrCreateEmailAndGenerateCode(emailString: string) {
    let email = await this._EmailRepository.get(emailString)
    if (!email) email = await this.create(emailString)

    if (email.hasTooManyRequestAttempts())
      throw ErrorHandler.build(statusCodes.BAD_REQUEST, UserResponses.EMAIL_MANY_REQUEST_ATTEMPTS)

    const updated = await this.generateEmailCodeAndUpdate(email)
    return this._EmailMapper.mapToDTO(updated)
  }
}
