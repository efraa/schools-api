import { DatabaseConnection } from './database/DatabaseConnection'
import { Application, Router } from 'express'

// Modules
import { userModule } from './application/user/modules/UserModule'
import { schoolModule } from './application/school/modules/SchoolModule'
import { studentModule } from './application/student/modules/StudentModule'
import { teacherModule } from './application/teacher/modules/TeacherModule'

// Routes
import { UserRoutes } from './application/user/routes/UserRoutes'
import { SchoolRoutes } from './application/school/routes/SchoolRoutes'
import { StudentRoutes } from './application/student/routes/StudentRoutes'
import { TeacherRoutes } from './application/teacher/routes/TeacherRoutes'

export class Main {
  protected router: Router = Router()

  constructor(protected prefixRoute: string, protected app: Application) {
    this.app.use(this.prefixRoute, this.router)
  }

  public async init() {
    await this.databaseConnection()
    await this.buildRouting()
  }

  public async databaseConnection() {
    const connected = await DatabaseConnection
      .connect()

    if (connected)
      console.log(`[DATABASE]: connected on host: ${process.env.DB_HOST}`)
  }

  public buildRouting() {
    const userRoutes = new UserRoutes(this.router, userModule.controller).routes
    const schoolRoutes = new SchoolRoutes(this.router, schoolModule.controller).routes
    const studentRoutes = new StudentRoutes(this.router, studentModule.controller).routes
    const teacherRoutes = new TeacherRoutes(this.router, teacherModule.controller).routes

    this.router.use('/users', userRoutes)
    this.router.use('/schools', schoolRoutes)
    this.router.use('/students', studentRoutes)
    this.router.use('/teachers', teacherRoutes)
  }
}
