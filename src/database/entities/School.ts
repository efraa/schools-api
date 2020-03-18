import { Entity, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm'
import { BaseEntity } from '../baseEntities/BaseEntity'
import { lowercase, encode, capitalize } from '../transformers'

// Relations
import { User } from './User'
import { Requirement } from './Requirement'

@Entity({ name: 'schools' })
export class School extends BaseEntity {
  @Column({
    transformer: [capitalize]
  })
  name: string

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
    transformer: [lowercase]
  })
  type?: string

  @Column({
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

  @Column({
    transformer: [lowercase],
    nullable: true
  })
  postalCode: string

  @Column({
    type: 'simple-array',
    nullable: true
  })
  phones: string[]

  @Column({
    default: false
  })
  isPremium: boolean

  @Column()
  userId: number

  @OneToOne(type => User)
  @JoinColumn()
  user: User

  @OneToMany(type => Requirement, requirement => requirement.school, {
    nullable: true,
    onDelete: 'SET NULL'
  })
  admissionsRequirements: Requirement[]
}
