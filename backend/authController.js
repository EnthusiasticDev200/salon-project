const db = require('./database')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const dotenv = require("dotenv")
const {validationResult, cookie} = require("express-validator") // cookie or error?
const { notifyStylist } = require('./socketHandler');



dotenv.config()


//creating tables for admin, customer, stylist, services, appointments, and reviews
//use replace salon with /auth/ in url when hitting table endpoints
exports.adminTable = async(req, res)=>{
    const createAdminTable = `
        CREATE TABLE IF NOT EXISTS admins(
            admin_id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) NOT NULL UNIQUE,
            email VARCHAR(100) NOT NULL UNIQUE,
            phone_number VARCHAR(12) NOT NULL,
            role VARCHAR(50) NOT NULL,
            password_hash VARCHAR(100) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `
    try{
        await db.query(createAdminTable)
        res.status(200).send("Admin's table successfully created")
    }catch(error){
        console.log('Oops!! Error occured when creating table',error.stack)
        return res.status(500).send("Error creating admuns's table")
        
    }
}
exports.customerTable = async(req, res)=>{
const createCustomerTable = `
    CREATE TABLE IF NOT EXISTS customers(
        customer_id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        phone_number VARCHAR(12) NOT NULL,
        password_hash VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `
try{
    await db.query(createCustomerTable)
    res.status(200).send("Customers table successfully created")
}catch(error){
    console.log('Oops!! Error occured when creating table',error.stack)
    return res.status(500).send("Error creating customers table")
    
}
}

exports.stylistTable = async(req, res)=>{
    const createStylistTable = `
        CREATE TABLE IF NOT EXISTS stylists(
            stylist_id INT AUTO_INCREMENT PRIMARY KEY,
            first_name VARCHAR(50) NOT NULL,
            last_name VARCHAR(50) NOT NULL,
            username VARCHAR(50) NOT NULL UNIQUE,
            email VARCHAR(100) NOT NULL UNIQUE,
            phone_number VARCHAR(12) NOT NULL,
            password_hash VARCHAR(100) NOT NULL,
            specialization VARCHAR(100) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `
try{
    await db.query(createStylistTable)
    res.status(200).send("Stylists table successfully created")
}catch(error){
    console.log("Error encountered when creating stylist table", error.stack)
    return res.status(500).send("Error creating stylist table")

}
}

exports.serviceTable = async(req, res)=>{
    const createServiceTable = `
        CREATE TABLE IF NOT EXISTS services(
            service_id INT AUTO_INCREMENT PRIMARY KEY,
            hair_style VARCHAR(100) NOT NULL,
            price INT NOT NULL
        )
    `
try{
    await db.query(createServiceTable)
    res.status(200).send("Service table successfully created")
}catch(error){
    console.log("Service table cannot be created", error.stack)
    return res.status(500).send("Error creating service table")
}
}

exports.appointmentTable = async(req,res)=>{
    const createAppointmentTable = `
        CREATE TABLE IF NOT EXISTS appointments(
            appointment_id INT AUTO_INCREMENT PRIMARY KEY,
            customer_id INT NOT NULL,
            stylist_id INT NOT NULL,
            service_id INT NOT NULL,
            appointment_date DATE NOT NULL,
            appointment_time TIME NOT NULL,
            status VARCHAR(20) NOT NULL DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY fk_appointments_customers(customer_id)
            REFERENCES customers(customer_id)
                ON UPDATE CASCADE
                ON DELETE CASCADE,
            FOREIGN KEY fk_appointments_stylists(stylist_id)
            REFERENCES stylists (stylist_id)
                ON UPDATE CASCADE
                ON DELETE CASCADE,
            FOREIGN KEY fk_appointments_services(service_id)
            REFERENCES services(service_id)
                ON UPDATE CASCADE
                ON DELETE CASCADE   
        )
    `
try{
    await db.query(createAppointmentTable)
    res.status(200).send("Appointments table successfully created")
}catch(error){
    console.log("Appointment table not created", error.stack)
    return res.status(500).send("Appointment table creation failed.")

}
}

exports.reviewTable = async(req,res)=>{
    const createReviewTable = `
        CREATE TABLE IF NOT EXISTS reviews(
            review_id INT AUTO_INCREMENT PRIMARY KEY,
            customer_id INT NOT NULL,
            service_id INT NOT NULL,
            rating TINYINT CHECK (rating BETWEEN 1 AND 5),
            feedback TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY fk_reviews_customers(customer_id)
            REFERENCES customers(customer_id)
                ON UPDATE CASCADE
                ON DELETE CASCADE,
            FOREIGN KEY fk_reviews_services(service_id)
            REFERENCES services(service_id)
                ON UPDATE CASCADE
                ON DELETE CASCADE
        )
    `
try{
    await db.query(createReviewTable)
    res.status(200).send("Review table successfully created")
}catch(error){
    console.log("Review's table not created", error.stack)
    return res.status(500).send("Review's table creation failed.")
}
}

// creating registration for admin, customer, stylist, service and appointment

//all about admin
async function checkValidationResult(req){
    const errors = validationResult(req)
    console.log("validationErrorfunc: ", errors)
    if(!errors.isEmpty()){
      return errors.array();
    }
    return null
}
exports.registerAdmin = async (req, res) =>{
    try{
        const inputErrors = await checkValidationResult(req)
        console.log("inputErrorFunc: ", inputErrors)
        if(inputErrors){
            return res.status(400).json({ message: 'Please correct input errors', errors: inputErrors });
        }
        const {username, email, phoneNumber, role, password} = req.body
        const [checkAdmin] = await db.execute("SELECT * FROM admins WHERE email =?", [email])
        if(checkAdmin.length> 0){
            return res.status(400).json({message:"Admin already exist"})
        };
        const hashedPassword = await bcrypt.hash(password, 10)
        await db.query
        (`INSERT INTO admins(username, email, phone_number, role, password_hash) VALUE(?,?,?,?,?)`,
        [username, email, phoneNumber, role, hashedPassword])
        res.status(201).json({message:"Admin successfully created"});
    }catch(error){
        console.error("error found: ", error)
        res.status(500).json({message:'Error registering admin', error})
    }
}
exports.logInAdmin = async (req, res)=>{
    const {email, password} = req.body
    try{
        const [checkAdmin] = await db.query("SELECT * FROM admins WHERE email = ?", [email])
        if(checkAdmin.length === 0){
            return res.status(403).json({message:"Not an admin"})
        }
        const comfirmPassword = await bcrypt.compare(password, checkAdmin[0].password_hash)
        if(!comfirmPassword){
            return res.status(401).json({message:"Invalid password"})
        }
        const adminUser = checkAdmin[0]
        const payload =  
            {
                adminId: adminUser.admin_id,
                username: adminUser.username,
                role: adminUser.role,
            }
        const adminToken = jwt.sign(
            payload, 
            process.env.JWT_SECRET, 
            {expiresIn: "1h"})
        //drop any previous cookie
        res.clearCookie('admin_token'); 
        //setting up new cookie 
        res.cookie('admin_token', adminToken, 
            {
                httpOnly : true,
                secure : false,
                sameSite: 'Strict',
                maxAge : 60*60*1000
            })
        res.status(200).json({message:`Welcome ${checkAdmin[0].username}`})
    }catch(error){
        console.error("Error logging in admin", error)
        res.status(500).json({message:'Error loggin in admin', error:error.stack})
    }
}
exports.logoutAdmin = async(req, res)=>{
    try{
        const email = req.email
        res.clearCookie('admin_token')
        res.status(200).json({message:`Logout successful. Bye ${email}`}) // saying undefined
    }catch(error){
        console.error("Error loggin out admin", error)
        res.status(500).json({message:"Error login admin out", error:error.stack})
    }
}
//find admin by email function. This prevents code replication
async function findAdminByEmail(email) {
    try{
        const [queryAdmin] = await db.query("SELECT * FROM admins WHERE email=?",[email])
    if(queryAdmin.length === 0){
        return "Admin not found"; //throw new Error("Admin not found") don't throw error
    }
    return queryAdmin[0]
    }catch(error){
        console.error("Error finding admin", error)
        res.status(500).json({message:"Error finding admin", error:error.stack})
    }    
}
async function findStylistByEmail(email) {
    try{
        const [queryStylist] = await db.query("SELECT * FROM stylists WHERE email=?",[email])
    if(queryStylist.length === 0){
        return "Stylist not found"; //throw new Error("Stylist not found") don't throw error
    }
    return queryStylist[0]
    }catch(error){
        console.error("Error finding stylist", error)
        res.status(500).json({message:"Error finding stylist", error:error.stack})
    }
}
// forgot admin password login
exports.changeAdminPassword = async(req, res)=>{
   try{
    const {email, newPassword} = req.body
    const admin = await findAdminByEmail(email)
    if(!admin){
        return res.status(404).json({message:"Admin not found"}) 
    }
    //generate new password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)
    const [checkIfPasswordUpdated] = await db.query("SELECT * FROM admins WHERE password_hash=?", [hashedPassword])
    if(checkIfPasswordUpdated.length > 0){
        return res.status(401).json("Password already updated")
    }
    await db.query("UPDATE admins SET password_hash =? WHERE email = ?", [hashedPassword, email])
    res.status(201).json({message:"Passwword updated succesfully"})
   }catch(error){
    console.error("Error updating admin password", error)
    res.status(500).json({message:"Error updating admin password", error:error.stack})
   }
}
// all about customer
exports.registerCustomer = async (req, res)=>{

    try{
        const validateInput = await checkValidationResult(req)
        if(validateInput){
            return res.status(400).json({ message: 'Please correct input errors', errors: validateInput });
        }
        const {firstName, lastName, username, email, phoneNumber, password} = req.body
        const [customer] = await db.execute("SELECT * FROM customers WHERE email =?", [email])
        if(customer.length> 0){
            return res.status(400).json({message:"Customer already exist"})
        };
        const hashedPassword = await bcrypt.hash(password, 10)
        await db.query(`
            INSERT INTO 
                customers(first_name, last_name, username, email, phone_number, password_hash) 
                VALUE(?,?,?,?,?,?)`,
                [firstName, lastName, username, email, phoneNumber, hashedPassword]
        )
        res.status(201).json({message:"Customer successfully created"});
    }catch(error){
        res.status(500).json({message:'Error registering customer', error})
    }
}
// customer login AND authentication with jwt(06/4/25)
exports.logInCustomer =  async (req, res)=>{
    const {email, password} = req.body
    try{
        const [customer] = await db.query("SELECT * FROM customers WHERE email = ?", [email])
        // check if customer exist
        if(!customer || customer.length === 0){
            return res.status(400).json({message:"Customer's email doesn't exist. Please register"}); 
        }
        const passwordMatch = await bcrypt.compare(password,customer[0].password_hash)
        console.log('Password match',passwordMatch)
        if(!passwordMatch){
            return res.status(401).json({message:'Invalid password'})
        }
        // Now customer is a user. Create jwt
        const user = customer[0]
        const payload = 
        {
            userId:user.customer_id, 
            username:user.username,
        }
        const customerToken = jwt.sign(
            payload, 
            process.env.JWT_SECRET, 
            {expiresIn:'1h'}
        )
        //drop any previous cookie
        res.clearCookie('customer_token'); 
        //setting up new cookie 
        res.cookie('customer_token', customerToken, 
            {
                httpOnly : true,
                secure : false,
                sameSite: 'Strict',
                maxAge : 60*60*1000
            })
        res.status(200).json({message:`Login successful. Welcome ${user.username}`})
    }catch(err){
        console.error("Error during customer login", err)
        res.status(500).json({message: 'Log in error', err:err.stack})
    }
}
exports.CustomerProfile = async (req, res)=>{
    const userId = req.userId 
    if(!req.userId){
        return res.status(403).json({message:"Access denied. Kindly register"})
    }
    try{
        const [checkCustomer] = await db.query("SELECT * FROM customers WHERE customer_id=?", [userId])
        if(checkCustomer.length === 0){
            res.status(403).json({message:"No record found"})
        }
        //res.status(200).json({message:`You're authenticated. Welcome ${req.username}, userId: ${req.userId}`})
        const [checkMyappointment] = await db.query(`
            SELECT 
                appointment_id, 
                s.username AS stylist_username, 
                serv.hair_style AS hair_style, 
                DATE_FORMAT(appointment_date, '%Y-%m-%d') AS appointment_date,
                TIME_FORMAT(appointment_time, '%H:%i') AS appointment_time,
                status 
                FROM appointments 
                JOIN stylists s USING(stylist_id) 
                JOIN services serv USING(service_id)
                WHERE customer_id = ? `,
            [userId])
        if(checkMyappointment.length === 0){
            res.status(401).json({message: "You have not booked any appointment"})
        }
        res.status(200).send([checkMyappointment])
    }catch(err){
        console.error("Error fetching customer profile", err)
        res.status(500).json({message: 'Get profile error', err:err.stack})
    }
}
exports.logoutCustomer = async(req, res)=>{
    try{
        const username = req.username
        res.clearCookie('customer_token')
        res.status(200).json({message:`Logout successful. Bye ${username}`})
    }catch(error){
        console.error("Error loggin out customer", error)
        res.status(500).json({message:"Error login customer out", error:error.stack})
    }
}
exports.viewCustomers = async (req, res)=>{
    try{
        const [getCustomer] = await db.query
        ("SELECT customer_id, first_name, last_name, username, email, phone_number FROM customers")
        return res.status(200).json(getCustomer)
    }catch(err){
        console.error("Gettng customers failed", err)
        res.status(500).json({message: 'Error fetching customers', err:err.stack})
    }      
}
//services logic
exports.createServices = async (req, res)=>{
    const {hairStyle, price} = req.body
    try{
        const [checkHairStyle] = await db.execute("SELECT * FROM services WHERE hair_style =?", [hairStyle])
        if(!checkHairStyle || checkHairStyle.length === 0){
            await db.query(`INSERT INTO services(hair_style, price) VALUE(?,?)`, [hairStyle, price]);
            return res.status(200).json({message:"Service successfully created"})
        };
        if(checkHairStyle.length > 0){
            return res.status(401).json({message:'This service is already provided'})
        }
    }catch(err){
        console.error("Error detected", err)
        res.status(500).json({message:"Error detected in creating service", err:err.stack})
    }
}

exports.viewServices = async (req, res)=>{
    const [getSerivices] = await db.query("SELECT * FROM services")
    return res.status(200).send(getSerivices)
}
// stylist logic
exports.registerStylist = async (req, res)=>{   
    try{
        const checkStylistInput = await checkValidationResult(req)
        if(checkStylistInput){
            return res.status(400).json({message:"Please fix input error", errors:checkStylistInput})
        }
        const {firstName, lastName, username, email, phoneNumber, password, specialization} = req.body
        console.log(req.body)
        const [checkStylist] = await db.execute("SELECT * FROM stylists WHERE email =?", [email])
        if(checkStylist.length> 0){
            return res.status(400).json({message:"STylist alrady exist"})
    };
    const hashedPassword = await bcrypt.hash(password, 10)
    await db.query(`
        INSERT INTO 
            stylists(first_name, last_name, username, email, phone_number, password_hash, specialization) 
            VALUE(?,?,?,?,?,?,?)`,
            [firstName, lastName, username, email, phoneNumber, hashedPassword, specialization]
    )    
    res.status(201).json({message:"Stylist successfully created"});
    }catch(error){
        res.status(500).json({message:'Error registering stylist', error})
    }
}
exports.loginStylist = async (req, res)=>{
    try{
        const {email, password} = req.body
        const [checkStylist] = await db.query("SELECT * FROM stylists WHERE email = ?", [email])
        if(checkStylist.length === 0){
            return res.status(403).json({message:"Invalid stylist"})
        }
        const comfirmPassword = await bcrypt.compare(password, checkStylist[0].password_hash)
        if(!comfirmPassword){
            return res.status(401).json({message:"Invalid password"})
        }
        const stylistUser = checkStylist[0]
        const payload = 
            {
                stylistId : stylistUser.stylist_id,
                username : stylistUser.username,
            }
        const stylistToken = jwt.sign(
            payload, 
            process.env.JWT_SECRET, 
            {expiresIn: "1h"})
        //drop any previous cookie
        res.clearCookie('stylist_token'); 
        //setting up new cookie 
        res.cookie('stylist_token', stylistToken, 
            {
                httpOnly : true,
                secure : false,
                sameSite: 'Strict',
                maxAge : 60*60*1000
            })
        return res.status(200).json({message: `Welcome ${checkStylist[0].username}`})
    }catch(error){
        console.error('Error log in stylist', error)
        return res.status(500).json({message:"Error loggig in stylist", error:error.stack})
    }
}
exports.getStylistsUsername = async (req, res)=>{
    try{
        const stylistUsername = req.username
        const [getStylist] = await db.query(`
            SELECT *
                FROM stylists
                WHERE username = ?`,
            [stylistUsername])
        if(getStylist.length === 0){
            res.status(401).json({message: 'Stylist username does not exist'})
        }
        return res.status(200).json({ username: getStylist[0].username });
    }catch(error){
        console.error('Error getting stylist username', error)
        return res.status(500).json({message:"Failed fetching stylist username", error:error.stack})
    }
}
exports.stylistProfile = async (req, res)=>{
    try{
        const stylistId = req.stylistId
        const [checkStylist] = await db.query(`
            SELECT *
                FROM stylists
                WHERE stylist_id = ?`,
            [stylistId])
        if (checkStylist.lenght === 0){
            res.status(401).json({message: 'Not a stylist'})
        }
        const [myAppointments] = await db.query(`
            SELECT 
                appointment_id, 
                c.first_name AS customer_first_name, c.last_name AS customer_last_name, 
                serv.hair_style AS hair_style, 
                DATE_FORMAT(appointment_date, '%Y-%m-%d') AS appointment_date,
                TIME_FORMAT(appointment_time, '%H:%i') AS appointment_time,
                status 
                FROM appointments 
                JOIN customers c USING(customer_id)
                JOIN services serv USING(service_id) 
                WHERE stylist_id = ?`,
            [stylistId])
        if(myAppointments.length === 0){
            res.status(401).json({message:"No appointments record found"})
        }
        //res.status(200).send([myAppointments])
    }catch(error){
        console.error('Error getting stylist profile', error)
        return res.status(500).json({message:"Stylist profile error", error:error.stack})
    }
}
exports.logoutStylist = async (req, res)=>{
    try{
        const username = req.username
    res.clearCookie('stylist_token')
    res.status(200).json({message:`Logout succesfully. Bye ${username}`})
    }catch(error){
        console.error('Error loggin out stylist', error)
        return res.status(500).json({message:"Error loggig out stylist", error:error.stack})
    }
}
exports.viewStylists = async (req, res)=>{
    try{
        const [getStylists] = await db.query
        ("SELECT stylist_id, first_name, last_name, username, email, phone_number FROM stylists")
        return res.status(200).send(getStylists)   
    }catch(err){
        console.error("Getting stylists failed", err)
        return res.status(500).json({message:"Error fetching stylists", err:err.stack})
    }    
}
//appointments logic
exports.createAppointment = async (req, res) =>{
    
    try{
        const checkAppointmentInput = await checkValidationResult(req)
        if(checkAppointmentInput){
            return res.status(401).json({message:"Please fix error", errors:checkAppointmentInput })
        }
        const {stylistUsername,hairStyle, appointmentDate, appointmentTime, status} = req.body

        const userId = req.userId
        const [queryCustomer] = await db.query('SELECT * FROM customers WHERE customer_id = ?', [userId])
        const value = (stylistUsername)
        const [queryStylist] = await db.query("SELECT stylist_id FROM stylists WHERE username = ?", value)
        if(queryStylist.length === 0){
            return res.status(401).json({message:"Invalid stylist username"})
        }
        const [queryService] = await db.query(`
            SELECT * 
                FROM services 
                WHERE hair_style = ?`, 
                [hairStyle]
        )
        if(queryService.length === 0){
            return res.status(401).json({message:"We don't offer this service, pase check the service menu."})
        }
        //check existing Ap for data integrity
        const apCheckValue = [queryCustomer[0].customer_id]
        const [checkAppointment] = await db.query(`
            SELECT * 
                FROM 
                appointments 
                WHERE customer_id =? 
                AND appointment_date BETWEEN CURDATE() 
                AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)`,
            apCheckValue
        )
        if(checkAppointment.length > 0){
            console.log("appointmentDetails", checkAppointment)
            return res.status(400).json({message:"Appointment already booked for the week"});
        }
        const [checkStylistSpec] = await db.query(`
            SELECT 
                username, specialization 
                FROM stylists 
                WHERE 
                username =? AND FIND_IN_SET (?, REPLACE(specialization, ' ','')) > 0`, 
                [stylistUsername, hairStyle]
        )
        if(checkStylistSpec.length === 0){
            console.log("stylistSpec: ", checkStylistSpec)
            return res.status(401).json({message:"Not stylist's area of specialty"})
        }
        const apValue = [queryCustomer[0].customer_id,queryStylist[0].stylist_id, queryService[0].service_id, appointmentDate, appointmentTime, 'pending']
        const [insertResult] = await db.query(`
            INSERT INTO appointments
            (
                customer_id, stylist_id, service_id, 
                appointment_date, appointment_time,status
            ) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            apValue
        )    
        const appointmentData = 
        {
            appointmentId : insertResult.insertId,
            customerName : queryCustomer[0].first_name + ' ' + queryCustomer[0].last_name,
            customerUsername : queryCustomer[0].username,
            hairStyle : hairStyle,
            date : appointmentDate,
            time : appointmentTime,
            status : 'pending'
        }
        notifyStylist(stylistUsername, appointmentData)
        return res.status(201).json({message: `Appointment booked and stylist notified`})
    }catch(err){
        console.error("Appointment booking failed", err)
        return res.status(500).json({message:"Appointment creation failed", err:err.stack})
    }
}
exports.viewAppointments = async (req, res)=>{
    try{
        const [getAppointments] = await db.query(`
            SELECT 
                appointment_id, 
                c.first_name AS customer_first_name, c.last_name AS customer_last_name, 
                s.username AS stylist_username, 
                serv.hair_style AS hair_style, 
                DATE_FORMAT(appointment_date, '%Y-%m-%d') AS appointment_date,
                TIME_FORMAT(appointment_time, '%H:%i') AS appointment_time,
                status 
                FROM appointments 
                JOIN customers c USING(customer_id)
                JOIN stylists s USING(stylist_id) 
                JOIN services serv USING(service_id)
        `)
        console.log("appointment", getAppointments)
        return res.status(200).json(getAppointments)
    }catch(err){
        console.error("Getting appointments failed", err)
        return res.status(500).json({message:"Error fetching appointments", err:err.stack})
    }   
}
//review logic
exports.createReview = async(req,res)=>{
    try{
        const checkReviewInput = await checkValidationResult(req)
        if(checkReviewInput){
            return res.status(401).json({message:"Please fix error", errors:checkAppointmentInput })
        }
        const {hairStyle, rating, feedback} = req.body
        const userId = req.userId
        const [checkCustomer] = await db.query(`
            SELECT customer_id 
                FROM customers 
                WHERE customer_id = ?`,
            [userId])
        if(checkCustomer.length === 0){
            res.status(401).json({message: `Not a customer`})
        }
        const [queryService] = await db.query(`
            SELECT service_id 
                FROM services
                WHERE hair_style = ?`,
            [hairStyle])
        if(queryService.length === 0){
            res.status(401).json({message: 'Not a service you were offered'})
        }
        console.log("customer id", checkCustomer[0].customer_id)
        console.log("service id: ", queryService[0].service_id)
        const [checkReview] = await db.query(`
            SELECT * 
                FROM reviews
                WHERE customer_id = ? 
                AND service_id = ?`,
            [checkCustomer[0].customer_id, queryService[0].service_id])
        if(checkReview.length > 0){
           return res.status(401).json({message:'Review already created'})
        }
        await db.query(`
            INSERT INTO reviews
                (customer_id, service_id, rating, feedback)
                VALUE(?,?,?,?)`,
            [checkCustomer[0].customer_id, queryService[0].service_id, rating, feedback])
            res.status(201).json({message: 'Review successfully created'})
    }catch(error){
        console.log("Error creating review", error)
        res.status(500).json({message:'Creating review failed', error:error.stack})
    }
}
exports.viewReviews = async (req, res)=>{
    try{
        const [getReviews] = await db.query(`
            SELECT review_id, c.username, serv.hair_style, rating, feedback,rev.created_at
                FROM reviews rev
                JOIN customers c USING (customer_id)
                JOIN services serv USING (service_id)
            `)
        res.status(200).json(getReviews)
    }catch(error){
        console.log("Error fetching reviews", error)
        res.status(500).json({message:'Fetching reviews failed', error:error.stack})
    }
}
