import { multer, storage, validateExt } from './Multer'

export const userPictureMiddle = multer({
  storage,
  limits: {
    fileSize: 25000000
  },
  fileFilter: (req, file, cb) => {
    if (validateExt(/jpeg|png|jpg|PNG|JPG/, file.mimetype, file.originalname))
      cb(null, true)
    else cb(null, false)
  }
}).single('picture')
