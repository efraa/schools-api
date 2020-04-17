import { Mapper } from 'ts-simple-automapper'
import { StudentDTO, StudentRepository } from '../../providers/StudentProvider'
import { Student } from '../../../../database/entities/Student'
import { UserMapper } from '../../../../application/user/providers/UserProvider'

export class StudentMapper {
  constructor(
    private _StudentRepository: StudentRepository,
    private _UserMapper: UserMapper
  ) {}

  public mapToDTO(from: Student): StudentDTO {
    const studentDTO: StudentDTO = new Mapper().map(from, new StudentDTO())
    return studentDTO
  }

  public mapToEntity = async (from: any): Promise<Student> =>
    await this._StudentRepository.create(from as Student)

  public mapListToDTO = (students: Student[]): StudentDTO[] =>
    students.map(student => {
      student.user = this._UserMapper.mapToDTO(student.user) as any
      return this.mapToDTO(student)
    })
}
