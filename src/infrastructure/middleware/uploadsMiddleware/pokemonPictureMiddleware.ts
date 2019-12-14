import multer from 'multer'
import path from 'path'

import { Configuration as config } from '@config/Configuration'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.pokemonOptions.uploads)
  },
  filename: (req: any, file, cb) => {
    if (req.user && req.params && file) {
      const { mimetype } = file
      const { id } = req.user
      const name = `${req.params.slug}-${id}-${Date.now()}.${mimetype.split('/')[1]}`
      cb(null, name)
    }
  }
})

export const pokemonPictureMiddleware = multer({
  storage,
  limits: {
    fileSize: 25000000
  },
  fileFilter: (req, file, cb) => {
    const onlyExtension = /jpeg|png|jpg|PNG/
    const mimetype = onlyExtension.test(file.mimetype)
    const fileExtension = onlyExtension.test(path.extname(file.originalname))

    if (mimetype && fileExtension) cb(null, true)
    else cb(null, false)
  }
}).single('picture')
