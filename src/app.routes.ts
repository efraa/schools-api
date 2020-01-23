import { Router } from 'express'

// Routes
import { AuthRoutes } from './application/auth/auth.providers'
import { UserRoutes } from './application/user/user.providers'

// Declare routes
export const Routes: Array<Router> = [
  AuthRoutes,
  UserRoutes,
]
