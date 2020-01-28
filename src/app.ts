import 'reflect-metadata'
import express, { Application } from 'express'
import bodyParser from 'body-parser'
import compression from 'compression'
import cors from 'cors'
import morgan from 'morgan'

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
    this.app.use(bodyParser.urlencoded({ extended: false }))
    this.app.use(bodyParser.json())
    this.app.use(morgan('dev'))
    this.app.use(cors())
    this.app.use(compression())
    console.log(process.env.NODE_ENV)
  }

  public listen = async (cb: () => void) =>
    await this.app.listen(this.port, cb)
}

export default new App()
