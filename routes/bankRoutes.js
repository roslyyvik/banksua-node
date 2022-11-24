const express = require('express')
const router = express.Router()

const rateLimiter = require('express-rate-limit')
const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: 'Too many requests this IP, please try again after 15 minutes',
})

const { getAllBanks, getSingleBank } = require('../controllers/bankController')
const {
  authenticateUser
} = require('../middleware/authentication')

router
  .route('/')
  .get(getAllBanks)

router
  .route('/:mfo')
  .get(getSingleBank)

module.exports = router