const { format } = require('date-fns')
const { v4: uuid } = require('uuid')
const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')

const logEvents = async (message, logFileName) => {
    const dateTime = format(new Date(), 'yyyyMMdd\tHH:mm:ss')
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`

    try {
        if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) { //check to see if directory exists (if it does not exist)
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs')) //then we will create it
        }
        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logFileName), logItem) //now that we've created the directory or if it already exists, we will be appending the logItem 
    } catch (err) {
        console.log(err)
    }
}

const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'reqLog.log') 
    console.log(`${req.method} ${req.path}`)
    next()
}

module.exports = { logEvents, logger }