import multer from 'multer'
import path from 'path'
import { Configuration as config } from '../../../../config/Configuration'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.utils.uploads)
  },
  filename: (req, file, cb) => {
    if (req.user && file) {
      const { mimetype } = file
      const { uuid } = req.user
      const name = `${uuid}-${Date.now()}.${mimetype.split('/')[1]}`
      cb(null, name)
    }
  }
})

const validateExt = (extensions: RegExp, mimetype: string, ext: string) =>
  extensions.test(mimetype) && extensions.test(path.extname(ext)) ? true : false

export {
  storage,
  multer,
  validateExt
}
