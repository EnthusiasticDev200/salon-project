const mysql = require('mysql2')
const dotenv = require('dotenv')
const fs = require('fs')


dotenv.config()
let db;

if(process.env.NODE_ENV === 'development'){
    db = mysql.createPool(
        {
            host : process.env.DB_HOST_DEV,
            user : process.env.DB_USERNAME_DEV,
            password : process.env.DB_PASSWORD_DEV,
            database : process.env.DATABASE_DEV
        }
    )
}else{
    db =  mysql.createPool(
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
}

module.exports = db.promise()