import { Entity, Column } from 'typeorm'
import { Roles } from '../../../infrastructure/utils'
import { BaseEntity } from '../../../database/BaseEntity'

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Column()
  name: string

  @Column({
    nullable: true
  })
  lastname: string

  @Column({
    unique: true
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
