import { MapProp } from 'ts-simple-automapper'

export class SchoolDTO {
  @MapProp()
  id: number

  @MapProp()
  name: string

  @MapProp()
  dean: string

  @MapProp()
  slogan: string

  @MapProp()
  type: string

  @MapProp()
  zone: string

  @MapProp()
  district: {
    name: string,
    code: string,
  }

  @MapProp()
  website: string

  @MapProp()
  location: {
    name: string,
    lat: string,
    long: string,
  }

  @MapProp()
  postalCode: string

  @MapProp()
  phones: string[]

  @MapProp()
  isPremium: boolean

  @MapProp()
  userId: number

  @MapProp()
  user: object

  @MapProp()
  admissionsRequirements: {}[]
}
