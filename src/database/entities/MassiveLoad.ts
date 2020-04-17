import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm'
import { BaseEntity } from '../baseEntities/BaseEntity'
import { lowercase, encode, capitalize } from '../transformers'

// Relations
import { User } from './User'

@Entity({ name: 'massive_loads' })
export class MassiveLoad extends BaseEntity {
  @Column()
  userId: number

  @ManyToOne(type => User, {
    cascade: ['update', 'insert']
  })
  @JoinColumn()
  user: User
}
