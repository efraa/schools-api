import { Entity, Column } from 'typeorm'
import { Roles } from '../../../infrastructure/utils'
import { BaseEntity } from '../../../database/BaseEntity'
import { lowercase, encode, capitalize } from '../../../database/transformers'

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Column({
    transformer: [capitalize]
  })
  name: string

  @Column({
    nullable: true,
    transformer: [capitalize]
  })
  lastname: string

  @Column({
    unique: true,
    transformer: [lowercase, encode]
  })
  email: string

  @Column({
    unique: true
  })
  username: string

  @Column()
  password: string

  @Column({
    type: 'simple-json',
    nullable: true
  })
  picture: {
    url: string,
    id: string,
  }

  @Column({
    type: 'enum',
    enum: Roles
  })
  role: Roles

  @Column({
    nullable: true
  })
  codeSchool: string

  @Column({
    default: false
  })
  isGoogle: boolean

  @Column({
    default: false
  })
  isVerified: boolean

  @Column({
    default: false
  })
  isPremium: boolean

  @Column({
    default: false
  })
  isActive: boolean

  @Column({
    default: true
  })
  onBoarding: boolean

  @Column({
    nullable: true
  })
  forgotPasswordToken: string

  @Column({
    nullable: true
  })
  forgotPasswordExpire: Date
}
