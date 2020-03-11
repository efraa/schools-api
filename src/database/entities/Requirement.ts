import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm'
import { BaseEntity } from '../BaseEntity'
import { lowercase } from '../transformers'

// Relations
import { School } from './School'

@Entity({ name: 'requirements' })
export class Requirement extends BaseEntity {
  @Column({
    transformer: [lowercase]
  })
  title: string

  @Column()
  schoolId: number

  @ManyToOne(type => School, { nullable: false, onUpdate: 'CASCADE' })
  @JoinColumn()
  school: School
}
