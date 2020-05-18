import { MapProp } from 'ts-simple-automapper'

export class UserDTO {
  @MapProp()
  id: number

  @MapProp()
  uuid: string

  @MapProp()
  name: string

  @MapProp()
  lastname: string

  @MapProp()
  email: string

  @MapProp()
  username: string

  @MapProp()
  picture: {
    url: string,
    id: string,
  }

  @MapProp()
  role: string

  @MapProp()
  codeSchool: string

  @MapProp()
  isGoogle: boolean

  @MapProp()
  isVerified: boolean

  @MapProp()
  isPremium: boolean

  @MapProp()
  isActive: boolean

  @MapProp()
  onBoarding: boolean
}