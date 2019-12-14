import multer from 'multer'
import path from 'path'

import { Configuration as config } from '@config/Configuration'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.userOptions.uploads)
  },
  filename: (req, file, cb) => {
    if (req.user && file) {
      const { mimetype } = file
      const { uuid } = req.user
      const name = `${uuid}-${Date.now()}.${mimetype.split('/')[1]}`
      cb(null, name)
      req.user.picture = name
    }
  }
})

export const userPictureMiddleware = multer({
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
