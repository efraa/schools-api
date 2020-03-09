import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, BeforeInsert, OneToOne, OneToMany } from 'typeorm'
import { Roles, UserStatus } from '../../application/user/providers/UserProvider'
import { lowercase, encode } from '../transformers'
import bcrypt from 'bcryptjs'

// Relations
import { School } from './School'
import { Teacher } from './Teacher'
import { Student } from './Student'
import { Session } from './Session'

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @PrimaryGeneratedColumn('uuid')
  uuid: string

  @CreateDateColumn()
  createAt: Date

  @Column({
    unique: true,
    nullable: true,
    transformer: [lowercase, encode]
  })
  email?: string

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

  @OneToOne(type => School, school => school.user)
  school: School | null

  @OneToOne(type => Teacher, teacher => teacher.user)
  teacher: Teacher | null

  @OneToOne(type => Student, student => student.user)
  student: Student | null

  @OneToMany(type => Session, session => session.user)
  sessions: Session[]

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
