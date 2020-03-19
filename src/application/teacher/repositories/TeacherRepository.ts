import { Repository, EntityRepository, FindManyOptions } from 'typeorm'
import { Teacher } from '../../../database/entities/Teacher'

@EntityRepository(Teacher)
export class TeacherRepository extends Repository<Teacher> {
  public getByUserId = async (userId: number): Promise<Teacher|undefined> =>
    await this.manager.getRepository(Teacher).findOne({ userId })

  public updateTeacher = async (teacher: Teacher, updates: any): Promise<Teacher|undefined> =>
    await this.manager.getRepository(Teacher).merge(teacher, updates)

  public getAll = async (query: FindManyOptions<Teacher> = {}): Promise<Teacher[]> =>
    await this.manager.getRepository(Teacher).find(query)
}
