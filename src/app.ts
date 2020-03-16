import 'reflect-metadata'
import { Configuration as config } from '../config/Configuration'
import express, { Application } from 'express'
import { Main } from './main'
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
app.get('/', (req, res) =>
  res.status(200).send({ msg: 'API Server of Schools Application' }))

if (process.env.NODE_ENV === 'development') {
  BullBoard.setQueues(Worker.queues.map(job => job.queue))
  app.use('/jobs', BullBoard.UI)
  app.use(morgan('dev'))
}

const initialize = () =>
  new Main(config.server.prefixRoutes as string, app).init()

export {
  app,
  initialize,
}
