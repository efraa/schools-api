import 'reflect-metadata'
import { Configuration as config } from '../config/Configuration'
import { Routing } from './infrastructure/http/routes'
import express, { Application } from 'express'
import compression from 'compression'
import { Worker } from '../workers'
import BullBoard from 'bull-board'
import morgan from 'morgan'
import cors from 'cors'

// Express Application
const app: Application = express()

// Middlewares
app.use(express.urlencoded({ extended: false }))
app.set('port', config.server.port)
app.use(express.json())
app.use(compression())
app.use(cors())

if (process.env.NODE_ENV === 'development') {
  BullBoard.setQueues(Worker.queues.map(job => job.queue))
  app.use('/jobs', BullBoard.UI)
  app.use(morgan('dev'))
}

// Routes
app.use(Routing.build())

export {
  app
}
