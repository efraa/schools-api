import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToOne, JoinColumn, ManyToOne } from 'typeorm'
import { capitalize } from '../transformers'

// Relations
import { User } from './User'
import { School } from './School'
import { Classroom } from './Classroom'

@Entity({ name: 'students' })
export class Student {
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

  @Column()
  userId: number

  @OneToOne(type => User, user => user.school, {
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
}
