import jwt, { Secret } from 'jsonwebtoken'
import { Configuration } from '@config/Configuration'

export class JWToken {
  public verifyToken = async (token: string): Promise<string|object> =>
    await jwt.verify(token, Configuration.jwt.secret as string | Buffer)

  public generateToken = async (user: any): Promise<string> =>
    await jwt.sign(
      { user },
      Configuration.jwt.secret as Secret,
      { expiresIn: Configuration.jwt.tokenExpire }
    )
}

