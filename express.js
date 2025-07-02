require('dotenv').config();
const express = require('express')
const cors = require("cors")
const cookieParser = require('cookie-parser')
const authRoutes = require('./backend/routes/authRoutes')
const http = require('http')
const path = require('path')
const app = express()
const server = http.createServer(app)
const {initSocket} = require('./backend/socketHandler')

//cors set-up
app.use(cors({
    origin : "http://localhost:3100", //change to Vite later
    credentials : true
}))

//middleware
app.use(express.json())
app.use(cookieParser());

//troutes
app.use('/auth',authRoutes) //all endpointmust start with auth

app.get('/salon/admin/login', (req, res)=>{
    res.sendFile(path.join(__dirname, '/frontend/admins/loginAdmin.html'))
})
app.get('/salon/admin/changepw', (req,res)=>{
    res.sendFile(path.join(__dirname, '/frontend/admins/changeAdminPassword.html'))
})
app.get('/salon/customer/login', (req, res)=>{
    res.sendFile(path.join(__dirname, '/frontend/customers/loginCustomer.html'))
})
app.get('/salon/customer/dashboard', (req, res)=>{
    res.sendFile(path.join(__dirname,'/frontend/customers/customerDashboard.html'))
})
app.get('/salon/stylist/login', (req, res)=>{
    res.sendFile(path.join(__dirname, '/frontend/stylists/loginStylist.html'))
})
app.get('/salon/stylist/dashboard', (req, res)=>{
    res.sendFile(path.join(__dirname,'/frontend/stylists/stylistDashboard.html'))
})

app.get('/salon/appointment', (req, res)=>{
    res.sendFile(path.join(__dirname, "/frontend/appointments/createAp.html"))
})
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


