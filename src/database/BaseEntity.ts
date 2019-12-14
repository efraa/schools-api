import { Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm'

@Entity()
export class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @PrimaryGeneratedColumn('uuid')
  uuid: string

  @CreateDateColumn()
  createDate: Date
}
