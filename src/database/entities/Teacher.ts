import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToOne, JoinColumn, ManyToMany, ManyToOne } from 'typeorm'
import { lowercase, capitalize } from '../transformers'

// Relations
import { User } from './User'
import { School } from './School'
import { Classroom } from './Classroom'

@Entity({ name: 'teachers' })
export class Teacher {
  @PrimaryGeneratedColumn()
  id: number

  @CreateDateColumn()
  createAt: Date

  @Column({
    transformer: [capitalize]
  })
  name: string

  @Column({
    transformer: [capitalize]
  })
  lastname: string

  @OneToOne(type => Classroom, classroom => classroom.teacherInCharge)
  inChargeOfClassroom: Classroom | null

  @Column()
  userId: number

  @OneToOne(type => User, user => user.school, {
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
}
