import { Mapper } from 'ts-simple-automapper'
import { TeacherDTO, TeacherRepository } from '../../providers/TeacherProvider'
import { Teacher } from '../../../../database/entities/Teacher'

export class TeacherMapper {
  constructor(private _TeacherRepository: TeacherRepository) {}

  public mapToDTO(from: Teacher): TeacherDTO {
    const teacherDTO: TeacherDTO = new Mapper().map(from, new TeacherDTO())
    return teacherDTO
  }

  public mapToEntity = async (from: any): Promise<Teacher> =>
    await this._TeacherRepository.create(from as Teacher)

  public mapListToDTO(teachers: Teacher[]): TeacherDTO[] {
    return teachers.map(teacher => this.mapToDTO(teacher))
  }
}
