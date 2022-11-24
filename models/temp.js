/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */
const agg = [
  {
    $match: {
      product: new ObjectId('615c873ad584c748cc86e5bb'),
    }
  },
  {
    $group: {
      _id: null,
      averageRating: {
       $avg: '$rating',
     },
     numberOfReviews: {
       $sum: 1,
     },
    }
  }
]

MongoClient.connect(
  'mongodb+srv://dbRosvik:6617754@academind-ec3oo.mongodb.net/bank-reports?authSource=admin&replicaSet=academind-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true',
  {useNewUrlParser: true, useUnifiedTopology: true},
  function (connectErr, client) {
    assert.equal(null, connectErr)
    const coll = client.db('').collection('');
   coll.aggregate(agg, (cmdErr, result) => {
     assert.equal(null, cmdErr);
   });
   client.close();
  }
)