import { MapProp } from 'ts-simple-automapper'

export class SessionDTO {
  @MapProp()
  location: {
    country: string,
    region: string,
    timezone: string,
    city: string,
  }

  @MapProp()
  device: {
    name: string,
    version: string,
    os: string,
  }

  @MapProp()
  browser?: string

  @MapProp()
  ip?: string

  @MapProp()
  lastActive: Date
}
