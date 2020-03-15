import { Entity, Column } from 'typeorm'
import { BaseEntity } from '../baseEntities/BaseEntity'
import { lowercase, encode } from '../transformers'
import { Configuration as config } from '../../../config/Configuration'

@Entity({ name: 'emails' })
export class Email extends BaseEntity {
  @Column({
    unique: true,
    transformer: [lowercase, encode]
  })
  email: string

  @Column({
    nullable: true
  })
  code: number

  @Column({
    default: 0,
    name: 'verify_failed_attemps'
  })
  verifyFailedAttempts: number

  @Column({
    default: 0,
    name: 'requests_attemps'
  })
  requestsAttempts: number

  @Column()
  expire: Date

  @Column({
    default: false
  })
  isVerified: boolean

  hasTooManyRequestAttempts = (): boolean =>
    this.requestsAttempts >= config.maxRequestsAttempts

  hasTooManyVerifyFailedAttempts = (): boolean =>
    this.verifyFailedAttempts >= config.maxRequestsAttempts
}
