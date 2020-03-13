import { Entity, OneToOne, ManyToOne, JoinColumn } from 'typeorm'
import { BaseEntity } from '../baseEntities/BaseEntity'
import { lowercase, encode, capitalize } from '../transformers'

// Relations
import { Classroom } from './Classroom'
import { Teacher } from './Teacher'
import { School } from './School'

@Entity({ name: 'schedules' })
export class Schedule extends BaseEntity {
  @OneToOne(type => Classroom, classroom => classroom.schedule, {
    nullable: true
  })
  classroom: Classroom | null

  @ManyToOne(type => School, school => school.schedules, {
    nullable: true,
    cascade: ['update', 'insert']
  })
  @JoinColumn()
  school: School | null

  @ManyToOne(type => Teacher, teacher => teacher.schedules, {
    nullable: true,
    cascade: ['update', 'insert']
  })
  @JoinColumn()
  teacher: Teacher | null
}
