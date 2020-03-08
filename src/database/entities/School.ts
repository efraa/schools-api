import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToOne, JoinColumn } from 'typeorm'
import { User } from './User'
import { lowercase, encode, capitalize } from '../transformers'

@Entity({ name: 'schools' })
export class School {
  @PrimaryGeneratedColumn()
  id: number

  @CreateDateColumn()
  createAt: Date

  @Column({
    nullable: true,
    transformer: [capitalize]
  })
  dean: string

  @Column({
    nullable: true,
    transformer: [lowercase]
  })
  slogan?: string

  @Column({
    nullable: true,
    transformer: [lowercase]
  })
  zone?: string

  @Column({
    type: 'simple-json',
    nullable: true
  })
  district?: {
    name: string,
    code: string,
  }

  @Column({
    nullable: true,
    transformer: [lowercase, encode]
  })
  website?: string

  @Column({
    type: 'simple-json',
    nullable: true
  })
  location?: {
    name: string,
    lat: string,
    long: string,
  }

  @Column()
  userId: number

  @OneToOne(type => User, user => user.school, {
    cascade: ['update', 'insert']
  })
  @JoinColumn()
  user: User
}
