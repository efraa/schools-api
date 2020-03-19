import { Router } from 'express'
import { BaseRoutes } from './infrastructure/routes/BaseRoutes'

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

export class Routes {
  constructor(private router: Router) {
    this.build()
  }

  private addRoutes = (moduleRoutes: BaseRoutes) =>
    this.router.use(moduleRoutes.domain, moduleRoutes.routes)

  private build() {
    this.addRoutes(new UserRoutes('/users', userModule.controller))
    this.addRoutes(new SchoolRoutes('/schools', schoolModule.controller))
    this.addRoutes(new StudentRoutes('/students', studentModule.controller))
    this.addRoutes(new TeacherRoutes('/teachers', teacherModule.controller))
  }
}
