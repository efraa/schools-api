import { Repository, EntityRepository, FindManyOptions } from 'typeorm'
import { Student } from '../../../database/entities/Student'

@EntityRepository(Student)
export class StudentRepository extends Repository<Student> {
  public getByUserId = async (userId: number): Promise<Student|undefined> =>
    await this.manager.getRepository(Student).findOne({ userId })

  public updateStudent = async (student: Student, updates: any): Promise<Student|undefined> =>
    await this.manager.getRepository(Student).merge(student, updates)

  public getAll = async (query: FindManyOptions<Student> = {}): Promise<Student[]> =>
    await this.manager.getRepository(Student).find(query)
}
