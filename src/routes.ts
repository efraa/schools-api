import { Router } from 'express'

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

export const routes = (router: Router): Router => {
  const userRoutes = new UserRoutes(router, userModule.controller).routes
  const schoolRoutes = new SchoolRoutes(router, schoolModule.controller).routes
  const studentRoutes = new StudentRoutes(router, studentModule.controller).routes
  const teacherRoutes = new TeacherRoutes(router, teacherModule.controller).routes

  router.use('/users', userRoutes)
  router.use('/schools', schoolRoutes)
  router.use('/students', studentRoutes)
  router.use('/teachers', teacherRoutes)

  return router
}
