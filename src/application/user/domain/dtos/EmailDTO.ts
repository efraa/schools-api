import { MapProp } from 'ts-simple-automapper'

export class EmailDTO {
  @MapProp()
  email: string

  @MapProp()
  code: number

  @MapProp()
  verifyFailedAttempts: number

  @MapProp()
  requestsAttempts: number

  @MapProp()
  expire: Date

  @MapProp()
  isVerified: boolean
}
