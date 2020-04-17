import { Repository, EntityRepository, FindManyOptions, Like, FindOperator } from 'typeorm'
import { Student } from '../../../database/entities/Student'

@EntityRepository(Student)
export class StudentRepository extends Repository<Student> {
  public getByUserId = async (userId: number): Promise<Student|undefined> =>
    await this.manager.getRepository(Student).findOne({ userId })

  public updateStudent = async (student: Student, updates: any): Promise<Student|undefined> =>
    await this.manager.getRepository(Student).merge(student, updates)

  public getAll = async (query: FindManyOptions<Student> = {}): Promise<Student[]> =>
    await this.manager.getRepository(Student).find(query)

  public async list(query: {
    page: number,
    perPage: number,
    name?: string,
    lastname?: string,
    classroomId?: number,
    schoolId: number,
  }) {
    const { page, perPage, name, lastname, classroomId, schoolId } = query
    const where: {
      schoolId: number,
      name?: FindOperator<string>,
      lastname?: FindOperator<string>,
      classroomId?: number
    } = { schoolId }

    if (name) where.name = Like(`%${name?.toLocaleLowerCase()}%`)
    if (lastname) where.lastname = Like(`%${lastname?.toLocaleLowerCase()}%`)
    if (classroomId) where.classroomId = classroomId

    const [rows, count] = await this.manager.getRepository(Student).findAndCount({
      skip: ((perPage * page) - perPage),
      take: perPage,
      relations: ['user', 'classroom'],
      order: {
        id: 'DESC'
      },
      where,
    })

    return {
      rows,
      allStudents: count,
      pages: Math.ceil(count / perPage),
    }
  }
}
