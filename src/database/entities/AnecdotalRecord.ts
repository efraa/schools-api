import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm'
import { BaseEntity } from '../baseEntities/BaseEntity'
import { lowercase, encode, capitalize } from '../transformers'

// Relations
import { Teacher } from './Teacher'
import { Student } from './Student'

@Entity({ name: 'anecdotal_records' })
export class AnecdotalRecord extends BaseEntity {
  @ManyToOne(type => Teacher, teacher => teacher.anecdotalRecords, {
    nullable: true,
    cascade: ['update', 'insert']
  })
  @JoinColumn()
  reportedBy: Teacher | null

  @ManyToOne(type => Student, student => student.anecdotalRecords, {
    cascade: ['update', 'insert']
  })
  @JoinColumn()
  student: Student
}
