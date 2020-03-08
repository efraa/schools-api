import { Mapper } from 'ts-simple-automapper'
import { SessionRepository, SessionDTO } from '../../providers/SessionProvider'
import { Session } from '../../../../database/entities/Session'

export class SessionMapper {
  constructor(private _SessionRepository: SessionRepository) {}

  public mapToDTO(from: any): SessionDTO {
    const sessionDTO: SessionDTO = new Mapper().map(from, new SessionDTO())
    return sessionDTO
  }

  public mapToEntity = async (from: any): Promise<Session> =>
    await this._SessionRepository.create(from as Session)

  public mapListToDTO(sessions: Session[]): SessionDTO[] {
    return sessions.map(session => this.mapToDTO(session))
  }
}
