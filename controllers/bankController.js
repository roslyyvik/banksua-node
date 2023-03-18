const Bank = require('../models/Bank.js')
const Review = require('../models/Review')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')

const getAllBanks = async (req, res) => {
  const banks = await Bank
  .find({})
  .populate({ path: 'reviews', select: 'title' })
  res.status(StatusCodes.OK).json({ banks, count: banks.length })
}

const getSingleBank = async (req, res) => {
  const { mfo: bankMfo } = req.params
  const bank = await Bank
  .findOne({MFO: bankMfo})
  .populate({
    path:'reviews',
    populate: {
      path: 'user',
      select: '_id name'
    }
})
  if(!bank) {
    throw new CustomError.NotFoundError(`There are not bank with MFO: ${bankMfo}`)
  }
  res.status(StatusCodes.OK).json({ bank })
}

const getSingleIdBank = async (req, res) => {
  const { id: bankId } = req.params
  const idBank = await Bank
  .findOne({_id: bankId})
  .populate({
    path:'reviews',
    populate: {
      path: 'user',
      select: '_id name'
    }
})
  if(!idBank) {
    throw new CustomError.NotFoundError(`There are not bank with ID: ${bankId}`)
  }
  res.status(StatusCodes.OK).json({ idBank })
}

module.exports = {
  getAllBanks,
  getSingleBank,
  getSingleIdBank,
}
