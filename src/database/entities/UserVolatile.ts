import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, JoinColumn, OneToOne } from 'typeorm'
import { User } from './User'

@Entity({ name: 'users_volatile_data' })
export class UserVolatite {
  @PrimaryGeneratedColumn()
  id: number

  @CreateDateColumn()
  createAt: Date

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

  @Column()
  userId: number

  @OneToOne(type => User, user => user.school, {
    cascade: ['update', 'insert']
  })
  @JoinColumn()
  user: User
}
