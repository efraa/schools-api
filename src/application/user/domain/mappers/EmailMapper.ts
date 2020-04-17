import { Mapper } from 'ts-simple-automapper'
import { EmailRepository, EmailDTO } from '../../providers/EmailProvider'
import { Email } from '../../../../database/entities/Email'

export class EmailMapper {
  constructor(private _EmailRepository: EmailRepository) {}

  public mapToDTO = (from: any): EmailDTO =>
    new Mapper().map(from, new EmailDTO())

  public mapToEntity = async (from: any): Promise<Email> =>
    await this._EmailRepository.create(from as Email)

  public mapListToDTO = (emails: Email[]): EmailDTO[] =>
    emails.map(email => this.mapToDTO(email))
}
