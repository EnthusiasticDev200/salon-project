require('dotenv').config();
const express = require('express')
const cors = require("cors")
const cookieParser = require('cookie-parser')
const authRoutes = require('./backend/routes/authRoutes')
const http = require('http')
const app = express()
const server = http.createServer(app)
const {initSocket} = require('./backend/socketHandler')

//cors set-up
app.use(cors({
    "origin" : "http://localhost:5173",
    "credentials" : true
}))

//middleware
app.use(express.json())
app.use(cookieParser());

//troutes
app.use('/auth',authRoutes) //all endpointmust start with auth

//Socket set-up
initSocket(server); // initializing initSocket

//landing page route
app.get('/', (req,res)=>{
    res.send("Welcome to KhleanCutz Salon")
})

const port = 3100
server.listen(port, ()=>{
    console.log(`Server is running on http://localhost:${port}`)
})


