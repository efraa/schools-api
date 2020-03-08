import { MapProp } from 'ts-simple-automapper'

export class SchoolDTO {
  @MapProp()
  id: number

  @MapProp()
  userId: number
}
