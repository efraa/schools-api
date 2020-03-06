import { multer, storage, validateExt } from './Multer'

export const bulkLoadMiddle = multer({
  storage,
  limits: {
    fileSize: 55000000
  },
  fileFilter: (req, file, cb) => {
    if (validateExt(/csv/, file.mimetype, file.originalname))
      cb(null, true)
    else cb(null, false)
  }
}).single('csv')
