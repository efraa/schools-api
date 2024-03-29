import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, OneToOne } from 'typeorm'
import { BaseEntity } from '../baseEntities/BaseEntity'
import { Roles, UserStatus } from '../../application/user/providers/UserProvider'
import { SchoolDTO } from '../../application/school/domain/dtos/SchoolDTO'
import { lowercase, encode } from '../transformers'
import bcrypt from 'bcryptjs'

// Relations
import { School } from './School'
import { Teacher } from './Teacher'
import { Student } from './Student'

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid: string

  @Column({
    nullable: true,
    transformer: [lowercase, encode]
  })
  email?: string

  @Column({
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

  @OneToOne(type => School, school => school.user, {
    nullable: true
  })
  school: School | null

  @OneToOne(type => Teacher, teacher => teacher.user, {
    nullable: true
  })
  teacher: Teacher | null

  @OneToOne(type => Student, student => student.user, {
    nullable: true
  })
  student: Student | null

  @Column({
    type: 'simple-json',
    nullable: true
  })
  account: SchoolDTO | {}

  comparePassword = (password: string): boolean =>
    bcrypt.compareSync(password, this.password)

  @BeforeInsert()
  encryptPassword(password?: string): string {
    const pass = password ? password : this.password
    const encrypted = bcrypt.hashSync(pass, 10)
    this.password = encrypted
    return encrypted
  }

  isActive = (): boolean =>
    this.status === UserStatus.DELETED || this.status === UserStatus.DISABLED ? false : true
}
