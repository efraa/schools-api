import { Router } from 'express'

// Routes
import { AuthRoutes } from '@app/auth/auth.providers'

// Declare routes
export const Routes: Array<Router> = [
  AuthRoutes
]
