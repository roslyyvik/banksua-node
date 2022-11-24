const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema({
  rating: {
    type: Number,
    min:1,
    max: 5,
    required: [true, 'Please provide rating']
  },
  title: {
    type: String,
    trim: true,
    required:[true, 'Please provide review title'],
    maxlength: 100,
  },
  comment: {
    type: String,
    required:[true, 'Please provide review text'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  bank: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bank',
    required: true
  },
},{timestamp: true}
)
ReviewSchema.index({ bank: 1, user: 1 }, { unique: true })

ReviewSchema.static.calculateAverageRating = async function(bankId) {
  const result = await this.aggregate([
    { $match: { bank: bankId } },
    {
      $group: {
        _id: null,
        averageRating: {$avg: '$rating'},
        numOfReviews: { $sum: 1 }
      },
    },
  ])
  try {
    await this.modal('Bank').findOneAndUpdate(
      {_id: bankId},
      {
        averageRating: Math.ceil(result[0]?.averageRating || 0),
        numOfReviews: result[0]?.numOfReviews || 0
      }
    )
  } catch (error) {
    console.log(error);
  }
}

ReviewSchema.post('save', async function() {
  await this.constructor.calculateAverageRating(this.bank)
})
ReviewSchema.post('remove', async function() {
  await this.constructor.calculateAverageRating(this.bank)
})

module.exports = mongoose.model('Review', ReviewSchema)