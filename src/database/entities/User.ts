import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm'
import { BaseEntity } from '../baseEntities/BaseEntity'
import { Roles, UserStatus } from '../../application/user/providers/UserProvider'
import { lowercase, encode } from '../transformers'
import bcrypt from 'bcryptjs'

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid: string

  @Column({
    unique: true,
    nullable: true,
    transformer: [lowercase, encode]
  })
  email?: string

  @Column({
    unique: true,
    nullable: true,
  })
  username?: string

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
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.INCOMPLETE
  })
  status: UserStatus

  @Column({
    default: false
  })
  isGoogle: boolean

  @Column({
    nullable: true,
    unique: true
  })
  forgotToken: string

  @Column({
    nullable: true
  })
  forgotExpire: Date

  comparePassword = async (password: string): Promise<boolean> =>
    await bcrypt.compareSync(password, this.password)

  @BeforeInsert()
  async encryptPassword(password?: string): Promise<string> {
    const pass = password ? password : this.password
    const encrypted = await bcrypt.hashSync(pass, 10)
    this.password = encrypted
    return encrypted
  }

  isActive = (): boolean =>
    this.status === UserStatus.DELETED || this.status === UserStatus.DISABLED ? false : true
}
