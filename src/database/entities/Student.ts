import { Entity, Column, OneToOne, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { CommonOfPersonsEntity } from '../baseEntities/CommonOfPersonsEntity'
import { lowercase } from '../transformers'

// Relations
import { User } from './User'
import { School } from './School'
import { Classroom } from './Classroom'
import { Incident } from './Incident'
import { AnecdotalRecord } from './AnecdotalRecord'

@Entity({ name: 'students' })
export class Student extends CommonOfPersonsEntity {
  @Column({
    transformer: [lowercase],
    nullable: true
  })
  folio: string

  @Column({
    transformer: [lowercase],
    nullable: true
  })
  RNE: string

  @Column()
  userId: number

  @OneToOne(type => User, user => user.student, {
    nullable: false,
    cascade: ['update', 'insert']
  })
  @JoinColumn()
  user: User

  @Column()
  classroomId: number

  @ManyToOne(type => Classroom, classroom => classroom.students, {
    nullable: true,
    cascade: ['update', 'insert']
  })
  @JoinColumn()
  classroom: Classroom

  @Column()
  schoolId: number

  @ManyToOne(type => School, { nullable: false, onUpdate: 'CASCADE' })
  @JoinColumn()
  school: School

  @OneToMany(type => Incident, incident => incident.student, {
    onDelete: 'SET NULL'
  })
  incidents: Incident[]

  @OneToMany(type => AnecdotalRecord, anecdotalRecord => anecdotalRecord.student, {
    onDelete: 'SET NULL'
  })
  anecdotalRecords: AnecdotalRecord[]
}
