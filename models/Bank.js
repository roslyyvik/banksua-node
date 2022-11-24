const mongoose = require('mongoose')

const BankSchema = new mongoose.Schema({
  KOD_EDRPOU: String,
  SHORTNAME: String,
  NKB: String,
  P_IND: String,
  NP: String,
  ADRESS: String,
  D_OPEN: String,
  MFO: String,
  group: String,
  SVB: String,
  SPEC_OSCHAD: String,
  STATUS: String,
  assetstotal: [Number],
  liabilities: [Number],
  capitaltotal: [Number],
  profittotal: [Number],
  averageRating: {
    type: Number,
    default: 0
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  indicators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'indicators' }],
  normatives: [{ type: mongoose.Schema.Types.ObjectId, ref: 'normatives' }]
},
{ timestamp: false, toJSON: {virtuals:true}, toObject: {virtuals:true} }
)

BankSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'bank',
  justOne: false,
})
BankSchema.pre('remove', async function (next) {
  await this.model('Review').deleteMany({ bank: this._id })
})

module.exports = mongoose.model('Bank', BankSchema)