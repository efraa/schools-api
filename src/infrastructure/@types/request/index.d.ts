import { UserDTO } from '@app/user/user.providers'

declare global {
  namespace Express {
    export interface Request {
      user?: UserDTO
    }
  }
}