require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const { logger,logEvents } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/dbConn')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 3500

console.log(process.env.NODE_ENV)

connectDB()

app.use(logger)

app.use(cors(corsOptions))

app.use(express.json()) //allows app to receive and parce json data

app.use(cookieParser())

app.use('/', express.static(path.join(__dirname, '/public')))

app.use('/', require('./routes/root'))
app.use('/auth', require('./routes/authRoutes'))
app.use('/notes', require('./routes/noteRoutes'))
app.use('/users', require('./routes/userRoutes'))

app.all('*', (req, res) => { //listens to EVERYTHING
    res.status(404)
    if (req.accepts('html')) { //if request has an accepts header that is html
        res.sendFile(path.join(__dirname, 'views', '404.html')) //send our 404 html
    } else if (req.accepts('json')) {
        res.json({message: '404 Not Found'})
    } else {
        res.type('txt').send('404 Not Found')
    }
})

app.use(errorHandler)

mongoose.connection.once('open', () => {
    console.log('Connected to MonoDB')
    app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))
})

mongoose.connection.on('error', err => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,'mongoErrLog.log')
})

