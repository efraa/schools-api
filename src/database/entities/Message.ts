import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm'
import { BaseEntity } from '../baseEntities/BaseEntity'
import { lowercase, encode, capitalize } from '../transformers'

// Relations
import { User } from './User'

@Entity({ name: 'messages' })
export class Message extends BaseEntity {
  @Column()
  content: string

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

  @ManyToOne(type => User, {
    cascade: ['update', 'insert']
  })
  @JoinColumn()
  user: User
}
