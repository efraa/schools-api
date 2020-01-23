import { UserDTO } from '../../../application/user/user.providers'

declare global {
  namespace Express {
    export interface Request {
      user?: UserDTO
    }
  }
}