const Indicator = require('../models/Indicator')
const CustomError = require('../errors')
const { StatusCodes } = require('http-status-codes')

const getAllIndicators = async (req, res) => {
  const indicators = await Indicator.find({})
  res.status(StatusCodes.OK).json(indicators)
}

const getSingleBankIndicators = async (req, res) => {
  const { mfo } = req.params
  const indicator = await Indicator
    .find({ mfo })
  if(!indicator || indicator.length === 0) {
    throw new CustomError.NotFoundError(`Not found with ${mfo}`)
  }
  // res.status(StatusCodes.OK).json({ indicator, count: indicator.length })
  res.status(StatusCodes.OK).json(indicator)
}

module.exports = { getAllIndicators, getSingleBankIndicators }
