import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm'
import { BaseEntity } from '../baseEntities/BaseEntity'
import { lowercase, encode, capitalize } from '../transformers'

// Relations
import { Teacher } from './Teacher'

@Entity({ name: 'monthly_planning' })
export class MonthlyPlanning extends BaseEntity {
  @ManyToOne(type => Teacher, {
    cascade: ['update', 'insert']
  })
  @JoinColumn()
  teacher: Teacher
}
