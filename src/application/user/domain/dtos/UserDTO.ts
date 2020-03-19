import { MapProp } from 'ts-simple-automapper'

export class UserDTO {
  @MapProp()
  id: number

  @MapProp()
  uuid: string

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
  status: string

  @MapProp()
  account: {} | null
}
