require('dotenv').config();
const mockData = require('./mock-data.json');
const Bank = require('./models/Bank');
const connectDB = require('./db/connect');

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    await Bank.create(mockData);
    console.log('Success !!!');
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();

