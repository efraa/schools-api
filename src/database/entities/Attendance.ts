import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm'
import { BaseEntity } from '../baseEntities/BaseEntity'
import { lowercase, encode, capitalize } from '../transformers'

// Relations
import { Classroom } from './Classroom'
import { Teacher } from './Teacher'
import { Student } from './Student'

@Entity({ name: 'attendances' })
export class Attendance extends BaseEntity {
  @ManyToOne(type => Classroom, {
    cascade: ['update', 'insert']
  })
  @JoinColumn()
  classroom: Classroom

  @ManyToOne(type => Student, student => student.anecdotalRecords, {
    cascade: ['update', 'insert']
  })
  @JoinColumn()
  student: Student
}
