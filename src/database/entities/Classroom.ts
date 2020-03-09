import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToOne, JoinColumn, ManyToOne, ManyToMany, JoinTable, OneToMany } from 'typeorm'
import { lowercase } from '../transformers'

// Relations
import { School } from './School'
import { Teacher } from './Teacher'
import { Schedule } from './Schedule'
import { Student } from './Student'

@Entity({ name: 'classrooms' })
export class Classroom {
  @PrimaryGeneratedColumn()
  id: number

  @CreateDateColumn()
  createAt: Date

  @OneToOne(type => Teacher, teacher => teacher.inChargeOfClassroom, {
    cascade: ['update', 'insert']
  })
  @JoinColumn()
  teacherInCharge: Teacher

  @Column()
  schoolId: number

  @ManyToOne(type => School, school => school.classrooms, {
    cascade: ['update', 'insert']
  })
  @JoinColumn()
  school: School

  @Column()
  scheduleId: number

  @OneToOne(type => Schedule, schedule => schedule.classroom, {
    cascade: ['update', 'insert']
  })
  @JoinColumn()
  schedule: Schedule

  @ManyToMany(type => Teacher, teacher => teacher.classrooms)
  @JoinTable({ name: 'classrooms_and_teachers' })
  teachers: Teacher[]

  @OneToMany(type => Student, student => student.classroom)
  students: Student[]
}
