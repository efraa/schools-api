import jwt, { Secret } from 'jsonwebtoken'
import { Configuration as config } from '../../../config/Configuration'
import { UserDTO } from '../../application/user/domain/dtos/UserDTO'

export const JWToken = {
  verifyToken: async (token: string): Promise<any> =>
    await jwt.verify(token, config.jwt.secret as string | Buffer),

  generateToken: async (user: UserDTO) =>
    ({ token: await jwt.sign({ user }, config.jwt.secret as Secret,
      { expiresIn: config.jwt.tokenExpire })
    })
}
