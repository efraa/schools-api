import { MapProp } from 'ts-simple-automapper'

export class TeacherDTO {
  @MapProp()
  id: number

  @MapProp()
  name: string

  @MapProp()
  userId: number

  @MapProp()
  user: object
}
