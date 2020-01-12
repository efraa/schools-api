import { Router } from 'express'

// Routes
import { AuthRoutes } from '@app/auth/auth.providers'
import { UserRoutes } from '@app/user/user.providers'

// Declare routes
export const Routes: Array<Router> = [
  AuthRoutes,
  UserRoutes,
]
