import { SessionRepository, SessionMapper } from '../providers/SessionProvider'
import { Session } from '../../../database/entities/Session'
import { User } from '../../../database/entities/User'
import { UserMapper } from '../providers/UserProvider'
import { JWToken } from '../../../infrastructure/utils'
import ipInfo from 'geoip-lite'

export class SessionService {
  constructor(
    private _SessionRepository: SessionRepository,
    private _SessionMapper: SessionMapper,
    private _UserMapper: UserMapper,
  ) {}

  public mapToEntity = async (sessionPayload: any): Promise<Session> =>
   await this._SessionMapper.mapToEntity(sessionPayload)

  public async create(device: ClientInfo, user: User): Promise<{
    token: string
  }> {
    const userToDTO = await this._UserMapper.mapToDTO(user)
    const token = await JWToken.generateToken(userToDTO)
    const { ip, agent: { browser, device: agentDevice, os  }} = device
    const clientInfo = ipInfo.lookup(device.ip)
    const sessionMapped: Session = await this.mapToEntity({
      user,
      token,
      ip,
      browser: `${browser.name} ${browser.version}`,
      device: {
        name: agentDevice.name,
        version: agentDevice.version,
        os: `${os.name} ${os.version}`
      },
    })

    if (clientInfo && clientInfo.city) {
      const { country, region, timezone, city } = clientInfo
      sessionMapped.location = {
        country,
        region,
        timezone,
        city
      }
    }
    const session = await this._SessionRepository.save(sessionMapped)
    return { token: session.token }
  }
}
