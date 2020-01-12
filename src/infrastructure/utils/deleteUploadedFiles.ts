import fs from 'fs'
import path from 'path'

export const deleteUploadedFiles = async (imageRoute: string) => {
  const imagePath = path.resolve(__dirname, `../../../uploads/${imageRoute}`)
  if (fs.existsSync(imagePath)) await fs.unlinkSync(imagePath)
}
