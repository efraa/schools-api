import { MapProp } from 'ts-simple-automapper'

export class StudentDTO {
  @MapProp()
  id: number

  @MapProp()
  name: string

  @MapProp()
  userId: number

  @MapProp()
  user: object

  @MapProp()
  lastname: string

  @MapProp()
  birthdate: Date

  @MapProp()
  gender: string

  @MapProp()
  idDocument: number

  @MapProp()
  nationality: string

  @MapProp()
  location?: string

  @MapProp()
  postalCode: string

  @MapProp()
  phones: string[]

  @MapProp()
  folio: string

  @MapProp()
  RNE: string

  @MapProp()
  classroomId: number

  @MapProp()
  classroom: {}

  @MapProp()
  schoolId: number

  @MapProp()
  incidents: []

  @MapProp()
  anecdotalRecords: []
}
