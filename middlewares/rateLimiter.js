const rateLimit = require('express-rate-limit')


const strictLimiter = rateLimit({
    windowMs : 15 * 60 * 1000,
    max : 25, //Allows 10 request every 15mins per IP
    message : {error: 'Excess request. Try again later'},
    standardHeaders: true,
    legacyHeaders: false
})

const mildLimiter = rateLimit({
    windowMs : 15 * 60 *1000,
    max : 50,
    message : {error: "You're making too many request. Try again later"},
    standardHeaders: true,
    legacyHeaders: false
})

module.exports = {
    strictLimiter, mildLimiter
}