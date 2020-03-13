import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm'
import { BaseEntity } from '../baseEntities/BaseEntity'
import { lowercase, encode, capitalize } from '../transformers'

// Relations
import { School } from './School'
import { Teacher } from './Teacher'
import { Student } from './Student'

@Entity({ name: 'incidents' })
export class Incident extends BaseEntity {
  @ManyToOne(type => School, school => school.incidents, {
    nullable: true,
    cascade: ['update', 'insert']
  })
  @JoinColumn()
  school: School | null

  @ManyToOne(type => Teacher, teacher => teacher.incidents, {
    nullable: true,
    cascade: ['update', 'insert']
  })
  @JoinColumn()
  teacher: Teacher | null

  @ManyToOne(type => Student, student => student.incidents, {
    cascade: ['update', 'insert']
  })
  @JoinColumn()
  student: Student
}
