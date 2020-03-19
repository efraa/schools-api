import { Mapper } from 'ts-simple-automapper'
import { StudentDTO, StudentRepository } from '../../providers/StudentProvider'
import { Student } from '../../../../database/entities/Student'

export class StudentMapper {
  constructor(private _StudentRepository: StudentRepository) {}

  public mapToDTO(from: Student): StudentDTO {
    const studentDTO: StudentDTO = new Mapper().map(from, new StudentDTO())
    return studentDTO
  }

  public mapToEntity = async (from: any): Promise<Student> =>
    await this._StudentRepository.create(from as Student)

  public mapListToDTO(students: Student[]): StudentDTO[] {
    return students.map(student => this.mapToDTO(student))
  }
}
