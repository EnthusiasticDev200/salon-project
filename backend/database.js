const mysql = require('mysql2')
const dotenv = require('dotenv')
const fs = require('fs')


dotenv.config()

const db =  await mysql.createPool(
    {
        host: process.env.DB_HOST,
        user : process.env.DB_USERNAME,
        password : process.env.DB_PASSWORD,
        database : process.env.DATABASE,
        port : process.env.DB_PORT,
        ssl: {
            ca: fs.readFileSync(process.env.DB_CA)
        }, 
    }
)

module.exports = db.promise()