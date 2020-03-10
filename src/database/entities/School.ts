import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm'
import { lowercase, encode, capitalize } from '../transformers'

// Relations
import { User } from './User'
import { Teacher } from './Teacher'
import { Student } from './Student'
import { Classroom } from './Classroom'
import { Requirement } from './Requirement'

@Entity({ name: 'schools' })
export class School {
  @PrimaryGeneratedColumn()
  id: number

  @CreateDateColumn()
  createAt: Date

  @Column({
    transformer: [capitalize]
  })
  name: string

  @Column({
    nullable: true,
    transformer: [capitalize]
  })
  dean: string

  @Column({
    nullable: true,
    transformer: [lowercase]
  })
  slogan?: string

  @Column({
    nullable: true,
    transformer: [lowercase]
  })
  type?: string

  @Column({
    nullable: true,
    transformer: [lowercase]
  })
  zone?: string

  @Column({
    type: 'simple-json',
    nullable: true
  })
  district?: {
    name: string,
    code: string,
  }

  @Column({
    nullable: true,
    transformer: [lowercase, encode]
  })
  website?: string

  @Column({
    type: 'simple-json',
    nullable: true
  })
  location?: {
    name: string,
    lat: string,
    long: string,
  }

  @Column({
    default: false
  })
  isPremium: boolean

  @Column({
    type: 'simple-array',
    nullable: true
  })
  phones: string[]

  @Column()
  userId: number

  @OneToOne(type => User, user => user.school, {
    nullable: false,
    cascade: ['update', 'insert']
  })
  @JoinColumn()
  user: User

  @OneToMany(type => Classroom, classroom => classroom.school, {
    onDelete: 'SET NULL'
  })
  classrooms: Classroom[]

  @OneToMany(type => Teacher, teacher => teacher.school, {
    onDelete: 'SET NULL'
  })
  teachers: Teacher[]

  @OneToMany(type => Student, student => student.school, {
    onDelete: 'SET NULL'
  })
  students: Student[]

  @OneToMany(type => Requirement, requirement => requirement.school, {
    onDelete: 'SET NULL'
  })
  requirements: Requirement[]
}
