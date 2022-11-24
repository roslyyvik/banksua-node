const express = require('express')
const router = express.Router()
const { getAllIndicators, getSingleBankIndicators } = require('../controllers/indicatorsController')

router  
  .route('/')
  .get(getAllIndicators)

router
  .route('/:mfo')
  .get(getSingleBankIndicators)

module.exports = router