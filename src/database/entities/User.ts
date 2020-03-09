import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, BeforeInsert, OneToOne, OneToMany } from 'typeorm'
import { Roles, UserStatus } from '../../application/user/providers/UserProvider'
import { lowercase, encode, capitalize } from '../transformers'
import bcrypt from 'bcryptjs'

// Relations
import { School } from './School'
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
    transformer: [capitalize]
  })
  name: string

  @Column({
    nullable: true,
    transformer: [capitalize]
  })
  lastname?: string

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
    default: UserStatus.UNVERIFIED
  })
  status: UserStatus

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
  isPremium: boolean

  @Column({
    default: true
  })
  onBoarding: boolean

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

  generateCodeSchool = (uuid: string): User => {
    if (this.role === Roles.SCHOOL)
      this.codeSchool = uuid.split('-')[0].slice(1)

    return this
  }

  isActive = (): boolean =>
    this.status !== UserStatus.ACTIVE && this.status !== UserStatus.UNVERIFIED ? false : true
}
