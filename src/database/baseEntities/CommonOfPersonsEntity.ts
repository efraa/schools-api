import { Entity, Column } from 'typeorm'
import { capitalize, lowercase } from '../transformers'
import { BaseEntity } from './BaseEntity'

enum Genders {
  MALE = 'male',
  FEMALE = 'female',
}

@Entity()
export class CommonOfPersonsEntity extends BaseEntity {
  @Column({
    transformer: [capitalize]
  })
  name: string

  @Column({
    transformer: [capitalize]
  })
  lastname: string

  @Column({
    nullable: true
  })
  birthdate: Date

  @Column({
    type: 'enum',
    enum: Genders,
    nullable: true
  })
  gender: Genders

  @Column({
    nullable: true,
    name: 'identification_document',
    unique: true
  })
  idDocument: number

  @Column({
    transformer: [lowercase],
    nullable: true
  })
  nationality: string

  @Column({
    nullable: true
  })
  location?: string

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
}