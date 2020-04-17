import { UserResponses, UserService } from '../providers/UserProvider'
import { EmailRepository, EmailMapper } from '../providers/EmailProvider'
import { Email } from '../../../database/entities/Email'
import { generateRandomCode } from '../providers/UserProvider'
import { ErrorHandler, statusCodes } from '../../../infrastructure/routes'

export class EmailService {
  constructor(
    private _EmailRepository: EmailRepository,
    private _EmailMapper: EmailMapper,
    private _UserService: UserService,
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
    const isAccount = await this._UserService.getUserByEmail(emailString)
    if (isAccount)
      throw ErrorHandler.build(statusCodes.BAD_REQUEST, UserResponses.EMAIL_EXISTS)

    let email = await this._EmailRepository.get(emailString)
    if (!email) email = await this.create(emailString)

    if (email.hasTooManyRequestAttempts())
      throw ErrorHandler.build(statusCodes.BAD_REQUEST, UserResponses.EMAIL_MANY_REQUEST_ATTEMPTS)

    const updated = await this.generateEmailCodeAndUpdate(email)
    return this._EmailMapper.mapToDTO(updated)
  }

  public async verifyEmailCode(emailString: string, code: number) {
    const email = await this._EmailRepository.get(emailString)
    if (email) {
      if (email.hasTooManyVerifyFailedAttempts())
        throw ErrorHandler.build(statusCodes.BAD_REQUEST, UserResponses.EMAIL_MANY_REQUEST_ATTEMPTS)

      const isValidCodeAndExpiration = await this._EmailRepository.getEmailWithCode(emailString, code)
      if (!isValidCodeAndExpiration) {
        const updated = await this._EmailRepository.updateEmail(email, {
          verifyFailedAttempts: email.verifyFailedAttempts += 1
        })

        if (updated) await this._EmailRepository.save(updated)

        throw ErrorHandler.build(statusCodes.UNAUTHORIZED, UserResponses.EMAIL_VERIFY_CODE)
      }

      const updateVerification = await this._EmailRepository.updateEmail(email, {
        verifyFailedAttempts: email.verifyFailedAttempts += 1,
        isVerified: true
      })
      if (updateVerification) {
        await this._EmailRepository.save(updateVerification)
        return this._EmailMapper.mapToDTO(updateVerification)
      }
    }

    throw ErrorHandler.build(statusCodes.NOT_FOUND, UserResponses.EMAIL_NOT_FOUND)
  }

  public delete = async (emailString: string) =>
    await this._EmailRepository.deleteByEmail(emailString)
}
