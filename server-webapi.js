require('dotenv').config()
const port = process.env.WEBAPI_PORT || 9999
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const initMongoDB = require('./server-mongodb')


// middleware
app.use(cors())
app.use(express.urlencoded({ extended : true}))
app.use(bodyParser.json())
app.use(express.json())

// routes
const productsController = require('./controllers/productsController')
app.use('/api/products', productsController)

// initialize
initMongoDB()
app.listen(port, () => console.log(`WebAPi is running on http://localhost:${port}`))