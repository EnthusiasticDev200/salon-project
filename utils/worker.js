require('dotenv').config()
const { Queue, Worker} = require('bullmq')
const Redis = require('ioredis')
const { sendOtpEmail } = require('./mailer')


// set-up redis connection (local and prod.)
let connection;
if(process.env.NODE_ENV === 'production' ) {
    connection = new Redis(process.env.REDIS_URL,{maxRetriesPerRequest : null })
}else{
    console.log('Worker on DEVELOPMENT')
    connection = new Redis('127.0.0.1:6379',{maxRetriesPerRequest : null })
}

// set up queue for otp-emails. Queue takes only connection as obj
const otpQueue = new Queue('otp-emails', { connection })

// setup worker 
const otpWorker = new Worker(
    'otp-emails', 
    async job => {
        const {email, otp} = job.data
        await sendOtpEmail(email, otp)}, 
    { connection }
)

module.exports = otpQueue






