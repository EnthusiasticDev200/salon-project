require('dotenv').config()
const { Queue, Worker} = require('bullmq')
const Redis = require('ioredis')
const { sendOtpEmail } = require('./mailer')


// set-up redis connection (local and prod.)

const connection = new Redis('127.0.0.1:6379',{
   maxRetriesPerRequest : null 
})



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

// otpWorker.on('completed', (job)=> {
//     console.log(`Job: ${job.id} is completed for ${job.data.email}`)
// })

// otpWorker.on("failed", (job, err) => {
//     console.error(`Job: ${job?.id} failed: ${err.message}`);
// });

module.exports = otpQueue






