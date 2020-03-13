import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm'
import { BaseEntity } from '../baseEntities/BaseEntity'
import { lowercase, encode, capitalize } from '../transformers'

// Relations
import { School } from './School'

@Entity({ name: 'contacts' })
export class Contact extends BaseEntity {
  @Column()
  schoolId: number

  @ManyToOne(type => School, school => school.contacts, {
    cascade: ['update', 'insert']
  })
  @JoinColumn()
  school: School
}
