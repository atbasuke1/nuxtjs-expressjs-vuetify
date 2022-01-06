const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser');
const createError = require('http-errors')
require('dotenv').config()
require('./helpers/init_mongodb')
const { verifyAccessToken } = require('./helpers/jwt_helper')
require('./helpers/init_redis')
const cors = require('cors')
const AuthRoute = require('./Routes/Auth.route')

const app = express()
app.use(morgan('dev'))
app.use(express.json())

app.use(cors())
app.get('/', verifyAccessToken, async (req, res, next) => {
  res.send('Hello from express.')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS')
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', AuthRoute)
app.use(async (req, res, next) => {
  next(createError.NotFound())
})
app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  })
})
const PORT = process.env.PORT || 8081

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})