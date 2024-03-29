const dotenv = require('dotenv')
dotenv.config()

const express = require('express')
const app = express()

require("express-async-errors")
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const cloudinary = require('cloudinary').v2
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
})
const cors = require('cors')
const corsOptions = require('./config/corsOption')
const rateLimiter = require('express-rate-limit')
const helmet =require('helmet')
const xss = require('xss-clean');
const mongoSanitize =require('express-mongo-sanitize')

const connectDB =require('./db/connect')

// routes
const authRouter =require('./routes/authRoutes')
const banksRouter = require('./routes/bankRoutes')
const reviewRouter = require('./routes/reviewsRoutes')
const userRouter = require('./routes/userRoutes')
const indicatorRouter = require('./routes/indicatorRoutes')

// middleware
const notFoundMiddleware = require('./middleware/not-found.js')
const errorHandlerMiddleware = require('./middleware/error-handler.js')

app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);
app.use(helmet())
app.use(cors()
)
app.use(xss())
app.use(mongoSanitize())

app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET));

// app.use(express.static('./public'));
app.use(fileUpload({ useTempFiles: true }));

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/banks', banksRouter)
app.use('/api/v1/reviews', reviewRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/indicators', indicatorRouter)

app.get('/', (req, res) => {
  res.send('Server is Started!')
})

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5500

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL)
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    })
  } catch (error) {
    console.log(error);
  }
}

start()
