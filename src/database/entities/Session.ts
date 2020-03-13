import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm'
import { BaseEntity } from '../baseEntities/BaseEntity'
import { User } from './User'
import { lowercase } from '../transformers'

@Entity({ name: 'sessions' })
export class Session extends BaseEntity {
  @Column({
    type: 'simple-json',
    nullable: true
  })
  location: {
    country: string,
    region: string,
    timezone: string,
    city: string,
  }

  @Column({
    nullable: true,
    transformer: [lowercase]
  })
  ip?: string

  @Column({
    type: 'simple-json',
    nullable: true
  })
  device: {
    name: string,
    version: string,
    os: string,
  }

  @Column({
    nullable: true,
    transformer: [lowercase]
  })
  browser?: string

  @Column({
    nullable: true,
    default: new Date()
  })
  lastActive: Date

  @Column({
    unique: true
  })
  token: string

  @Column()
  userId: number

  @ManyToOne(type => User, {
    cascade: ['update', 'insert']
  })
  @JoinColumn()
  user: User
}
