const express = require('express')
const cors = require('cors')

require('dotenv').config();

const conn = require('./db/conn')

const app = express()

const User = require('./models/User')
const Pet = require('./models/Pet')

const UserController = require('./controllers/UserController')

const userRoutes = require('./routes/UserRoutes')
const petRoutes = require('./routes/PetRoutes')


// Config JSON response
app.use(express.json())

// Solve CORS
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }))

// Public folder for images
app.use(express.static('public'))



app.use('/user', userRoutes)
app.use('/pet', petRoutes)

conn.sync().then(()=>{
    app.listen(5000)
})