import 'reflect-metadata'
import express, { Application } from 'express'
import compression from 'compression'
import cors from 'cors'
import morgan from 'morgan'
import BullBoard from 'bull-board'
import { Worker } from '../workers'

import { Routing } from './infrastructure/http/routes'
import { Configuration } from '../config/Configuration'

class App {
  private app: Application = express()
  public port: number = Configuration.server.port

  constructor () {
    this.middlewares()
    this.routes()
  }

  private routes = () => this.app.use(Routing.build())

  private middlewares(): void {
    this.app.use(express.urlencoded({ extended: false }))
    this.app.use(express.json())
    this.app.use(cors())
    this.app.use(compression())
    if (process.env.NODE_ENV === 'development') {
      this.app.use(morgan('dev'))
      BullBoard.setQueues(Worker.queues.map(job => job.queue));
      this.app.use('/jobs', BullBoard.UI)
    }
  }

  public listen = async (cb: () => void) =>
    await this.app.listen(this.port, cb)
}

export default new App()
