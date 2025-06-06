const express = require('express')
const cookieParser = require('cookie-parser')
require('dotenv').config();
const authRoutes = require('./backend/routes/authRoutes')
const path = require('path');
// const { authenticateJWT } = require('./middlewares/auth');
const http = require('http')
const app = express()
const server = http.createServer(app)
const {initSocket} = require('./backend/socketHandler')




initSocket(server); // initializing initSocket

const port = 3100



//middleware
app.use(express.json())
app.use(cookieParser());


//montroutes
app.use('/auth',authRoutes) //all endpointmust start with auth

// protecting all admin routes
// app.use("/admin", authenticateJWT)



//setting up socket



//landing page route
app.get('/', (req,res)=>{
    res.send("Welcome to KhleanCutz Salon")
})

// route for admin registration html. REMEMBER TO protect admin routes
app.get('/salon/regadmin', (req, res)=>{
    res.sendFile(path.join(__dirname,'/frontend/admins/registerAdmin.html'))
})

app.get('/salon/loginadmin', (req, res)=>{
    res.sendFile(path.join(__dirname, '/frontend/admins/loginAdmin.html'))
})

app.get('/salon/updateadmin', (req, res)=>{
    res.sendFile(path.join(__dirname, '/frontend/admins/changeAdminPassword.html'))
})


// route for customer registration html
app.get('/salon/regcustomer', (req, res)=>{
    res.sendFile(path.join(__dirname, '/frontend/customers/registerCustomer.html'))
})

// route for customer login  html
app.get('/salon/logincustomer', (req, res)=>{
    res.sendFile(path.join(__dirname, '/frontend/customers/loginCustomer.html'))
})

// route for creating services  html
app.get('/salon/addservice', (req, res)=>{
    res.sendFile(path.join(__dirname, '/frontend/services/createServices.html'))
})

//route for stylist registration  html
app.get('/salon/regstylist', (req, res)=>{
    res.sendFile(path.join(__dirname, '/frontend/stylists/registerStylist.html'))
})
//route for stylist registration  html
app.get('/salon/loginstylist', (req,res)=>{
    res.sendFile(path.join(__dirname, '/frontend/stylists/loginStylist.html'))
})
//route for stylist dashboard
app.get('/salon/stylist/dashboard', (req, res)=>{
    res.sendFile(path.join(__dirname, '/frontend/stylists/stylistDashboard.html'))
})


//route for appointment booking  html
app.get('/salon/createap', (req, res)=>{
    res.sendFile(path.join(__dirname, '/frontend/appointments/createAp.html'))
})

//route for creating review html
app.get('/salon/createreview', (req, res)=>{
    res.sendFile(path.join(__dirname, '/frontend/reviews/createReviews.html'))
})



// // io.on('connection', (socket) => {
// //     console.log('A user connected:', socket.id);

// //     // stylist listens for appointment notifications
// //     socket.on('stylistJoin', (stylistId) => {
// //         socket.join(`stylist_${stylistId}`);
// //     });

// //     // stylist responds to appointment
// //     socket.on('stylistResponse', async ({ appointmentId, status }) => {
// //         // update appointment status in database
// //         await db.query("UPDATE appointments SET status = ? WHERE appointment_id = ?", [status, appointmentId]);

// //         // notify frontend if needed
// //         io.emit('appointmentStatusUpdated', { appointmentId, status });
// //     });

// //     socket.on('disconnect', () => {
// //         console.log('User disconnected:', socket.id);
// //     });
// });


app.listen(port, ()=>{
    console.log(`Server is running on http://localhost:${port}`)
})


