const Review = require('../models/Review')
const Bank = require('../models/Bank.js')
const { StatusCodes } =require('http-status-codes')
const CustomError = require('../errors')
const { checkPermissions } = require('../utils');

const createReview = async (req, res) => {
  const { bank: bankId } = req.body

  const isValidBank = await Bank.findOne({ _id: bankId })
  if(!isValidBank) {
    throw new CustomError.NotFoundError(`No bank with id : ${bankId}`)
  }

  const alreadySubmitted = await Review.findOne({
    bank: bankId,
    user: req.user.userId,
   })

  if(alreadySubmitted) {
    throw new CustomError.BadRequestError(
      'Already submitted review for this bank'
    )
  }
  req.body.user = req.user.userId
  const review = await Review.create(req.body)

  res.status(StatusCodes.CREATED).json({ review })
}

const getAllReviews = async (req, res) => {
  const reviews = await Review.find({})
    .populate({
      path: 'bank',
      select: 'SHORTNAME MFO',
    })
    .populate({
      path: 'user',
      select: '_id name',
    })
    .sort('-createdAt')
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length })
}

const getSingleReview = async (req, res) => {
  const { id: reviewId } = req.params
  const review = await Review.findOne({ _id: reviewId })
  if(!review) {
    throw new CustomError.NotFoundError(`No review with id ${reviewId}`)
  }
  res.status(StatusCodes.OK).json({ review });
}

const updateReview = async (req, res) => {
  const { id: reviewId } = req.params
  const { rating, title, comment } = req.body

  const review = await Review.findOne({ _id: reviewId })
  if(!review) {
    throw new CustomError.NotFoundError(`No review with id ${reviewId}`)
  }
  checkPermissions(req.user, review.user)

  review.rating = rating
  review.title = title
  review.comment = comment

  await review.save()
  res.status(StatusCodes.OK).json({ review })
}

const deleteReview = async (req, res) => {
  const { id: reviewId } = req.params
  const review = await Review.findOne({ _id: reviewId })
  if(!review) {
    throw new CustomError.NotFoundError(`No review with id ${reviewId}`)
  }
  checkPermissions(req.user, review.user)
  await review.remove()
  res.status(StatusCodes.OK).json({ msg: 'Success! Review removed' })
}

const getSingleBankReviews = async (req, res) => {
  const { id: bankId } = req.params
  const reviews = await Review
    .find({ bank: bankId })
    .populate({
      path: 'bank',
      select: 'SHORTNAME MFO',
    })
    .populate({
      path: 'user',
      select: '_id name',
    })
    .sort('-createdAt')

  res.status(StatusCodes.OK).json({ reviews, count: reviews.length })
}

const getSingleUserReviews = async (req, res) => {
  const { id: userId } = req.params
  const reviews = await Review
    .find({ user: userId })
    .populate("bank", "_id SHORTNAME")
    .sort('-createdAt')
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length })
}

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleBankReviews,
  getSingleUserReviews,
}
