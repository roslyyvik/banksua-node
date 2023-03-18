const path = require('path')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const cloudinary = require('cloudinary').v2
const fs = require('fs')

const uploadUserImageLocal = async (req, res) => {
  if(!req.files) {
    throw new CustomError.BadRequestError('No File Uploaded')
  }
  const productImage = req.file.image
  if(!productImage.mimetype.startsWith('image')){
    throw new CustomError.BadRequestError('Please Upload Image')
  }
  const maxSize = 1024 * 1024
  if(productImage.size > maxSize) {
    throw new CustomError.BadRequestError('Please upload image smaller 1MB')
  }
  const imagePath = path.join(
    __dirname,
    '../public/uploads' + `${productImage.name}`
  )
  await productImage.mv(imagePath)
  return res
    .status(StatusCodes.OK)
    .json({ image: { src:`/uploads/${productImage.name}` } })
}

module.exports = {
  productImage,
}
