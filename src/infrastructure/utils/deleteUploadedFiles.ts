import fs from 'fs'
import path from 'path'

export const deleteUploadedFiles = (imageRoute: string) => {
  const imagePath = path.resolve(__dirname, `../../../uploads/${imageRoute}`)
  if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath)
}
