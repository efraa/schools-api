import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm'
import { lowercase, encode, capitalize } from '../transformers'

// Relations
import { Classroom } from './Classroom'

@Entity({ name: 'schedules' })
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number

  @CreateDateColumn()
  createAt: Date

  @OneToOne(type => Classroom, classroom => classroom.teacherInCharge)
  classroom: Classroom | null
}
