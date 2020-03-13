import { Entity, Column } from 'typeorm'
import { BaseEntity } from '../baseEntities/BaseEntity'
import { lowercase, encode } from '../transformers'

@Entity({ name: 'emails' })
export class Email extends BaseEntity {
  @Column({
    unique: true,
    transformer: [lowercase, encode]
  })
  email?: string

  @Column({
    transformer: [lowercase]
  })
  code: string

  @Column({
    default: 0
  })
  attempts: number

  @Column({
    default: 0
  })
  requestsAttempts: number

  @Column()
  expire: Date

  @Column({
    default: false
  })
  isVerified: boolean
}
