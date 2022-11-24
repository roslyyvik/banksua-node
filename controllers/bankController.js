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
  .populate('reviews')
  if(!bank) {
    throw new CustomError.NotFoundError(`There are not bank with MFO: ${bankMfo}`)
  }
  res.status(StatusCodes.OK).json({ bank })
}

module.exports = {
  getAllBanks,
  getSingleBank,
}
