import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm'
import { BaseEntity } from '../BaseEntity'
import { lowercase, encode, capitalize } from '../transformers'

// Relations
import { User } from './User'

@Entity({ name: 'messages' })
export class Message extends BaseEntity {
  @Column()
  userId: number

  @ManyToOne(type => User, user => user.sessions, {
    cascade: ['update', 'insert']
  })
  @JoinColumn()
  user: User
}
