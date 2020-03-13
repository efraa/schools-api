import { Entity, Column, OneToOne, JoinColumn, ManyToMany, ManyToOne, OneToMany } from 'typeorm'
import { CommonOfPersonsEntity } from '../baseEntities/CommonOfPersonsEntity'
import { lowercase } from '../transformers'

// Relations
import { User } from './User'
import { School } from './School'
import { Classroom } from './Classroom'
import { Schedule } from './Schedule'
import { Incident } from './Incident'
import { AnecdotalRecord } from './AnecdotalRecord'

@Entity({ name: 'teachers' })
export class Teacher extends CommonOfPersonsEntity {
  @OneToOne(type => Classroom, classroom => classroom.teacherInCharge)
  inChargeOfClassroom: Classroom | null

  @Column()
  userId: number

  @OneToOne(type => User, user => user.teacher, {
    nullable: false,
    cascade: ['update', 'insert']
  })
  @JoinColumn()
  user: User

  @ManyToMany(type => Classroom, classroom => classroom.teachers)
  classrooms: Classroom[]

  @Column()
  schoolId: number

  @ManyToOne(type => School, { nullable: false, onUpdate: 'CASCADE' })
  @JoinColumn()
  school: School

  @OneToMany(type => Schedule, schedule => schedule.teacher, {
    onDelete: 'SET NULL'
  })
  schedules: Schedule[]

  @OneToMany(type => Incident, incident => incident.teacher, {
    onDelete: 'SET NULL'
  })
  incidents: Incident[]

  @OneToMany(type => AnecdotalRecord, anecdotalRecord => anecdotalRecord.reportedBy, {
    onDelete: 'SET NULL'
  })
  anecdotalRecords: AnecdotalRecord[]
}
