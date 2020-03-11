import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm'
import { BaseEntity } from '../BaseEntity'
import { lowercase, encode, capitalize } from '../transformers'

// Relations
import { User } from './User'

@Entity({ name: 'notifications' })
export class Notification extends BaseEntity {
  @Column()
  title: string

  @Column({
    default: false
  })
  isRead: boolean

  @Column({
    default: false
  })
  isDeleted: boolean

  @Column()
  userId: number

  @ManyToOne(type => User, user => user.notifications, {
    cascade: ['update', 'insert']
  })
  @JoinColumn()
  user: User
}
