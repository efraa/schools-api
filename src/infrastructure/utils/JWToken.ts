import jwt, { Secret } from 'jsonwebtoken'
import { Configuration } from '../../../config/Configuration'

export const JWToken = {
  verifyToken: async (token: string): Promise<any> =>
    await jwt.verify(token, Configuration.jwt.secret as string | Buffer),

  generateToken: async (user: any): Promise<{ token: string }> =>
    ({
      token: await jwt.sign(
        { user },
        Configuration.jwt.secret as Secret,
        { expiresIn: Configuration.jwt.tokenExpire }
      )
    })
}
