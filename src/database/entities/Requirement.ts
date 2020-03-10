import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, JoinColumn, ManyToOne } from 'typeorm'
import { lowercase } from '../transformers'

// Relations
import { School } from './School'

@Entity({ name: 'requirements' })
export class Requirement {
  @PrimaryGeneratedColumn()
  id: number

  @CreateDateColumn()
  createAt: Date

  @Column({
    transformer: [lowercase]
  })
  title: string

  @Column()
  schoolId: number

  @ManyToOne(type => School, { nullable: false, onUpdate: 'CASCADE' })
  @JoinColumn()
  school: School
}
