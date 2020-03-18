import { SchoolService, SchoolResponses } from '../providers/SchoolProvider'
import { UserDTO, UserService, UserResponses } from '../../../application/user/providers/UserProvider'
import { ErrorHandler, statusCodes } from '../../../infrastructure/routes'

export class SchoolController {
  constructor(
    private _SchoolService: SchoolService,
    private _UserService: UserService,
  ) {}

  public async create(userLogged: UserDTO, schoolPayload: any) {
    const isCreated = await this._SchoolService.getByUserId(userLogged.id)
    if (isCreated)
      throw ErrorHandler.build(statusCodes.UNAUTHORIZED, SchoolResponses.SCHOOL_EXISTS)

    const user = await this._UserService.getUserById(userLogged.id)
    if (!user)
      throw ErrorHandler.build(statusCodes.BAD_REQUEST, UserResponses.USER_NOT_FOUND)

    const school = await this._SchoolService.mapToEntity({
      ...schoolPayload,
      location: {
        name: schoolPayload.locationName || null,
        lat: schoolPayload.locationLat || null,
        long: schoolPayload.locationLong || null,
      },
      district: {
        name: schoolPayload.districtName || null,
        code: schoolPayload.districtCode || null,
      },
      user
    })
    return await this._SchoolService.create(school)
  }
}
