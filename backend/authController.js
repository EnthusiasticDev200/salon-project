const db = require('./database')
const bcrypt = require('bcryptjs')
const dotenv = require("dotenv")
const { validationResult } = require("express-validator") 
const { notifyStylist, notifyCustomer } = require('./socketHandler');
const {sendOtpEmail} = require('../utils/mailer')
const generateJWToken = require('../utils/token')
const redis = require('../backend/redis')

dotenv.config()

async function checkValidationResult(req){
    const validationErrors = validationResult(req)
    //console.log("validationErrorfunc: ", validationErrors)
    if(!validationErrors.isEmpty()){
      return validationErrors.array().map(err=>err.msg); // return only msg prop
    }
    return null
}
exports.registerAdmin = async (req, res) =>{
    try{
        const apiStart = performance.now()
        const checkAdminInput = await checkValidationResult(req)
        if(checkAdminInput){
            return res.status(400).json(
                { message: 'Please correct input errors', 
                  validationErrors: checkAdminInput });
        }
        const {username, email, phoneNumber, role, password} = req.body
        const beforeDb = performance.now()
        const [checkAdmin] = await db.execute("SELECT admin_id FROM admins WHERE email =?", [email])
        const afterDb = performance.now() - beforeDb
        console.log("After query admin reg result", afterDb + 'ms')
        if(checkAdmin.length> 0){
            return res.status(400).json({message:"Admin already exist"})
        };
        const beforeHash = performance.now()
        const hashedPassword = await bcrypt.hash(password, 10)
        const afterHash = performance.now() - beforeHash
        console.log("After hash admin reg result:", afterHash + 'ms')
        await db.query
        (`INSERT INTO admins(username, email, phone_number, role, password_hash) VALUE(?,?,?,?,?)`,
        [username, email, phoneNumber, role, hashedPassword])
        const apiEnd = performance.now() - apiStart
        console.log("apiEnd admin reg result:", apiEnd + 'ms')
        return res.status(201).json({message:"Admin successfully created"});
    }catch(err){
        console.error("Registeration error: ", err)
        return res.status(500).json({
            message:'Error registering admin', 
            err:err.stack})
    }
}
exports.logInAdmin = async (req, res)=>{
    try{
        const apiStart = performance.now()
       
        const checkAdminLoginInput = await checkValidationResult(req)
       
        if(checkAdminLoginInput) return res.status(400).json(
            {
                message: 'Please fix input error',
                validationErrors: checkAdminLoginInput
            })
        const {email, password} = req.body
        // hit redis
        let cachedAdmin = await redis.get(`email:${email}`)
        let admin;
        if(cachedAdmin){
            admin = JSON.parse(cachedAdmin) // retrieve from redis
            console.log('parsed admin info', admin)
        }else{
            //hit db on miss
            const beforeDb = performance.now()
            const [checkAdmin] = await db.query(
            `SELECT admin_id, username, role, password_hash 
                FROM admins 
            WHERE email = ?
            `, [email])
            const afterDb = performance.now() - beforeDb
            console.log("After query result", afterDb + 'ms')
            if(checkAdmin.length === 0) return res.status(403).json({message:"Not an admin"});
            // capture admin db info
            const adminUser = checkAdmin[0]
            console.log('isAdmin:', adminUser)
            const adminData = {
                adminId : adminUser.admin_id,
                adminUsername: adminUser.username,
                role : adminUser.role
            }
            // update redis
            await redis.set(
                `email:${email}`,
                JSON.stringify(adminData),
                `EX`,
                20 * 60 // 20mins
            )
            // admin now has cloned adminData
            admin = {...adminData, password_hash: adminUser.password_hash} 
            console.log('admin cloned', admin)
        }
        if(!admin.password_hash){
            // hit db for password
            const [adminPassword] = await db.query(`SELECT password_hash FROM admins WHERE email = ?`, [email])
            admin.password_hash = adminPassword[0].password_hash//update admin
        }
       
        const beforeHash = performance.now()
        console.log('admin pw hash', admin.password_hash)
        const comfirmPassword = await bcrypt.compare(password, admin.password_hash)
        const afterHash = performance.now() - beforeHash
        console.log("After hash admin login result:", afterHash + 'ms')
        if(!comfirmPassword){
            return res.status(401).json({message:"Invalid password"})
        }
        const payload =  
            {
                adminId: admin.adminId,
                adminUsername: admin.adminUsername,
                role: admin.role,
            }
        console.log('admin Payload', payload)
        console.log('all from admin', admin)
        const refreshAdminPayload = {adminId: admin.adminId}
        const adminToken = generateJWToken.accessToken(payload)
        const refreshToken = generateJWToken.refreshToken(
            refreshAdminPayload
        )
        //drop any previous cookie
        res.clearCookie('admin_token'); 
        //setting up new cookie 
        res.cookie('admin_token', adminToken, 
            {
                httpOnly : true,
                secure : process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
                maxAge : 10 * 60 * 1000
            })
        res.cookie('refresh_admin_token', refreshToken, 
            {
                httpOnly : true,
                secure : process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
                maxAge : 24 * 60 * 1000
            })
        const apiEnd = performance.now() - apiStart
        console.log("apiEnd admin login result:", apiEnd + 'ms')
        return res.status(200).json({message:`Welcome ${admin.adminUsername}`})
    }catch(err){
        console.error("Error logging in admin", err)
        return res.status(500).json({
            message:'Error loggin in admin', 
            err:err.stack})
    }
}
exports.logoutAdmin = async(req, res)=>{
    try{
        const username = req.adminUsername
        res.clearCookie('admin_token')
        res.clearCookie('refresh_admin_token')
        return res.status(200).json({message:`Logout successful. Bye ${username}`}) 
    }catch(err){
        console.error("Error loggin out admin", err)
        return res.status(500).json({
            message:"Error login admin out", 
            err:err.stack})
    }
}

exports.changeAdminPassword = async(req, res)=>{
   try{
        const checkAdminPWInput = await checkValidationResult(req)
        if(checkAdminPWInput) return res.status(400).json({
            message: 'Please fix input error',
            validationErrors : checkAdminPWInput
        })
        const {email, newPassword} = req.body
        const jwtOtpEmail = req.jwtOtp.email
        //check if email and jwtEmail match
        if(jwtOtpEmail !== email){
            return res.status(401).json({message:'OTP verification required'})
        }
        //generate new password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt)
        const [checkIfPasswordUpdated] = await db.query("SELECT password_hash FROM admins WHERE password_hash=?", [hashedPassword])
        if(checkIfPasswordUpdated.length > 0){
            return res.status(401).json("Password already updated")
        }
        await db.query("UPDATE admins SET password_hash =? WHERE email = ?", [hashedPassword, email])
        return res.status(201).json({message:"Passwword updated succesfully"})
    }catch(err){
        console.error("Error updating admin password", err)
        return res.status(500).json({
            message:"Error updating admin password", 
            err:err.stack})
    }
}
// all about customer
exports.registerCustomer = async (req, res)=>{
    try{
        const apiStart = performance.now()
        const validateInput = await checkValidationResult(req)
        if(validateInput){
            return res.status(400).json({ 
                message: 'Please correct input errors', 
                validationErrors: validateInput });
        }
        const {firstName, lastName, username, email, phoneNumber, password} = req.body
        const beforeDb = performance.now()
        const [customer] = await db.execute("SELECT customer_id FROM customers WHERE email =?", [email])
        const afterDb = performance.now() - beforeDb
        console.log("After query cus reg result", afterDb + 'ms')
        if(customer.length> 0){
            return res.status(400).json({message:"Customer already exist"})
        };
        const beforeHash = performance.now()
        const hashedPassword = await bcrypt.hash(password, 10)
        const afterHash = performance.now() - beforeHash
        console.log("After hash cus reg result:", afterHash + 'ms')
        await db.query(`
            INSERT INTO 
                customers(first_name, last_name, username, email, phone_number, password_hash) 
                VALUE(?,?,?,?,?,?)`,
                [firstName, lastName, username, email, phoneNumber, hashedPassword]
        )
        const apiEnd = performance.now() - apiStart
        console.log("Api end cus reg result:", apiEnd + 'ms')
        return res.status(201).json({message:"Customer successfully created"});
    }catch(err){
        console.log('Registeration failed: ', err.message)
        return res.status(500).json({
            message:'Error registering customer', 
            err:err.stack})
    }
}
// customer login AND authentication with jwt(06/4/25)
exports.logInCustomer =  async (req, res)=>{
    try{
        const apiStart = performance.now()
        const checkLoginInput = await checkValidationResult(req)
        if(checkLoginInput) return res.status(400).json({
            message: 'Please fix input error',
            validationErrors :checkLoginInput
            })
        const {email, password} = req.body
        const beforeDb = performance.now()
        const [customer] = await db.query(
            "SELECT customer_id, username, password_hash FROM customers WHERE email = ?", [email])
        const afterDb = performance.now() - beforeDb
        console.log("After query cus lgoin result", afterDb + 'ms') 
        // check if customer exist
        if(!customer || customer.length === 0){
            return res.status(400).json({message:"Customer's email doesn't exist. Please register"}); 
        }
        const beforeHash = performance.now()
        const passwordMatch = await bcrypt.compare(password,customer[0].password_hash)
        const afterHash = performance.now() - beforeHash
        console.log("After hash login cus result:", afterHash + 'ms')
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
        const refreshCustomerPayload = {
            userId:user.customer_id,
        }
        const customerToken = generateJWToken.accessToken(payload)
        const refreshToken = generateJWToken.refreshToken(refreshCustomerPayload)
        //drop any previous cookie
        res.clearCookie('customer_token'); 
        //setting up new cookie 
        res.cookie('customer_token', customerToken, 
            {
                httpOnly : true,
                secure : process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
                maxAge : 10 * 60 *1000
            })
        res.cookie('refresh_customer_token', refreshToken, 
            {
                httpOnly : true,
                secure : process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
                maxAge : 24 * 60 * 1000
            })
        const apiEnd = performance.now() - apiStart
        console.log("Api cus login result:", apiEnd + 'ms')
        return res.status(200).json({message:`Login successful. Welcome ${user.username}`})
    }catch(err){
        console.error("Error during customer login", err)
        return res.status(500).json({message: 'Log in error', err:err.stack})
    }
}
exports.changeCustomerPassword = async(req, res)=>{
    try{
        const checkChangePWInput = await checkValidationResult(req)
        if(checkChangePWInput) return res.status(400).json({
            message: 'Please fix input error',
            validationErrors : checkChangePWInput
        })
        const {email, newPassword} = req.body
        const jwtOtpEmail = req.jwtOtp.email
        //check if email and jwtEmail match
        if(jwtOtpEmail !== email){
            return res.status(401).json({message:'OTP verification required'})
        }
        //generate new password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt)
        const [checkIfPasswordUpdated] = await db.query("SELECT password_hash FROM customers WHERE password_hash=?", [hashedPassword])
        if(checkIfPasswordUpdated.length > 0){
            return res.status(401).json("Password already updated")
        }
        await db.query(`
            UPDATE customers 
            SET password_hash =? 
            WHERE email = ?`, 
            [hashedPassword, email])
        return res.status(201).json({message:"Passwword updated succesfully"})
    }catch(err){
     console.error("Error updating customer password", err)
     return res.status(500).json({
        message:"Error updating customer password", 
        err:err.stack})
    }
 }
exports.getCustomerUsername = async (req, res)=>{
    try{
        const customerUsername = req.username
        if(!customerUsername) return res.status(401).json({message: `Wrong person asking`})
        const [getCustomer] = await db.query(`
            SELECT username
                FROM customers
                WHERE username = ?`,
            [customerUsername])
        if(getCustomer.length === 0){
            return res.status(401).json({message: 'Customer username does not exist'})
        }
        return res.status(200).json({ username: getCustomer[0].username });
    }catch(err){
        console.error('Error getting customer username', err)
        return res.status(500).json({
            message:"Failed fetching customer username", 
            err:err.stack})
    }
}
exports.customerAppointment = async (req, res)=>{
    const userId = req.userId 
    if(!userId){
        return res.status(403).json({message:"Access denied. Kindly register"})
    }
    try{
        const [checkCustomer] = await db.query("SELECT customer_id FROM customers WHERE customer_id=?", [userId])
        if(checkCustomer.length === 0){
            return res.status(403).json({message:"No record found"})
        }
        const [checkMyappointment] = await db.query(`
            SELECT 
                appointment_id AS appointmentId, 
                s.username AS stylistUsername, 
                serv.hair_style AS hairStyle, 
                DATE_FORMAT(appointment_date, '%Y-%m-%d') AS date,
                TIME_FORMAT(appointment_time, '%H:%i') AS time,
                status 
                FROM appointments 
                JOIN stylists s USING(stylist_id) 
                JOIN services serv USING(service_id)
                WHERE customer_id = ? `,
            [userId])
        if(checkMyappointment.length === 0){
           return res.status(401).json(checkMyappointment)
        }
        return res.status(200).json(checkMyappointment)
    }catch(err){
        console.error("Error fetching customer profile", err)
        return res.status(500).json({message: 'Get profile error', err:err.stack})
    }
}
exports.logoutCustomer = async(req, res)=>{
    try{
        const username = req.username;
        res.clearCookie('customer_token')
        res.clearCookie('refresh_customer_token')
        return res.status(200).json({message:`Logout successful. Bye ${username}`})
    }catch(err){
        console.error("Error loggin out customer", err)
        return res.status(500).json({
            message:"Error login customer out", 
            err:err.stack})
    }
}
exports.viewCustomers = async (req, res)=>{
    try{
        const [getCustomer] = await db.query(`
            SELECT customer_id, first_name, last_name, username, email, phone_number 
            FROM customers`)
        return res.status(200).json(getCustomer)
    }catch(err){
        console.error("Gettng customers failed", err)
        return res.status(500).json({message: 'Error fetching customers', err:err.stack})
    }      
}
exports.customerProfile = async (req, res)=>{
    try{
        const userId = req.userId
        if(!userId) return res.status(401).json({message: 'Sorry! Not for you'})
        const [getProfile] = await db.query(`
            SELECT customer_id, first_name, last_name, username, email, phone_number 
            FROM customers
            WHERE customer_id = ?`, [userId]);
        return res.status(200).json(getProfile)
    }catch(err){
        console.error("Gettng customer failed", err)
        return res.status(500).json({message: 'Error fetching customer', err:err.stack})
    }
}
exports.updateCustomerProfile = async (req, res)=>{
    try{
        const checkCusUpdateInput = await checkValidationResult(req)
        if(checkCusUpdateInput){
            return res.status(400).json({ 
                message: 'Please correct input errors', 
                validationErrors: checkCusUpdateInput });
        }
        const userId = req.userId;
        const {
            updateFirstName, updateLastName,
            updateEmail, updatePhoneNumber  } = req.body
        const [queryCustomer] = await db.query(`
            SELECT customer_id FROM customers WHERE customer_id = ?`, [userId])
        if(!queryCustomer || queryCustomer.length === 0) return 'Invalid customer'
        await db.query(`
            UPDATE customers 
            SET first_name = ?, last_name = ?, email = ?,phone_number = ?
            WHERE customer_id = ?`, 
            [updateFirstName, updateLastName, updateEmail,updatePhoneNumber, userId])
        return res.status(200).json({message: `Data updated successfully`})
    }catch(err){
        console.log(`Error Updating customer data: ${err.message}`)
        return res.status(500).json({message:`Failed to update customer data`})
    }
}
//services logic
exports.createServices = async (req, res)=>{
    try{
        const checkCreateServiceInput = await checkValidationResult(req)
        if(checkCreateServiceInput){
            return res.status(400).json({
                message: 'Please fix input errors',
                validationErrors : checkCreateServiceInput
            })
        }
        const {hairStyle, price} = req.body
        const [checkHairStyle] = await db.execute(`
            SELECT hair_style FROM services WHERE hair_style =?`, 
            [hairStyle])
        if(checkHairStyle.length > 0){
            return res.status(401).json({message:'This service is already provided'})
        }
        await db.query(`INSERT INTO services(hair_style, price) VALUE(?,?)`, [hairStyle, price]);
        return res.status(200).json({message:"Service successfully created"})
    }catch(err){
        console.error("Error detected", err)
        return res.status(500).json({
            message:"Error detected in creating service", 
            err:err.stack})
    }
}

exports.viewServices = async (req, res)=>{
    const [getSerivices] = await db.query("SELECT hair_style, price FROM services")
    return res.status(200).send(getSerivices)
}
// stylist logic
exports.registerStylist = async (req, res)=>{   
    try{
        const apiStart = performance.now()
        const checkStylistInput = await checkValidationResult(req)
        if(checkStylistInput){
            return res.status(400).json({
                message: "Please fix input error", 
                validationErrors: checkStylistInput})
        }
        const {firstName, lastName, username, email, phoneNumber, password, specialization} = req.body
        const beforeDb = performance.now()
        const [checkStylist] = await db.execute("SELECT email FROM stylists WHERE email =?", [email])
        const afterDb = performance.now() - beforeDb
        console.log("After db stylist reg result:", afterDb + 'ms')
        if(checkStylist.length> 0){
            return res.status(400).json({message:"STylist already exist"})
    };
        const beforeHash = performance.now()
        const hashedPassword = await bcrypt.hash(password, 10)
        const afterHash = performance.now() - beforeHash
        console.log("After hash stylist reg result:", afterHash + 'ms')
        await db.query(`
            INSERT INTO 
                stylists(first_name, last_name, username, email, phone_number, password_hash, specialization) 
                VALUE(?,?,?,?,?,?,?)`,
                [firstName, lastName, username, email, phoneNumber, hashedPassword, specialization]
        )   
        const apiEnd = performance.now() - apiStart
        console.log("Api stylist reg result:", apiEnd + 'ms') 
        return res.status(201).json({message:"Stylist successfully created"});
    }catch(err){
        return res.status(500).json({
            message:'Error registering stylist', 
            err: err.stack})
    }
}
exports.loginStylist = async (req, res)=>{
    try{
        const apiStart = performance.now()
        const checkStylistLoginInput = await checkValidationResult(req)
        if(checkStylistLoginInput){
            return res.status(400).json({ 
                message: 'Please correct input errors', 
                validationErrors: checkStylistLoginInput });
        }
        const {email, password} = req.body
        const beforeDb = performance.now()
        const [checkStylist] = await db.query(
            "SELECT stylist_id, username, password_hash FROM stylists WHERE email = ?", [email])
        const afterDb = performance.now() - beforeDb
        console.log("afterDb stylist login result:", afterDb + 'ms') 
        if(checkStylist.length === 0){
            return res.status(403).json({message:"Invalid stylist"})
        }
        const beforeHash = performance.now()
        const comfirmPassword = await bcrypt.compare(password, checkStylist[0].password_hash)
        const afterHash = performance.now() - beforeHash
        console.log("after hash stylist login result:", afterHash + 'ms') 
        if(!comfirmPassword){
            return res.status(401).json({message:"Invalid password"})
        }
        const stylistUser = checkStylist[0]
        const payload = 
            {
                stylistId : stylistUser.stylist_id,
                stylistUsername : stylistUser.username,
            }
        const refreshStylistPayload = { stylistId : stylistUser.stylist_id} 
        const stylistToken = generateJWToken.accessToken(payload)
        const refreshToken = generateJWToken.refreshToken(
            refreshStylistPayload
        )
        //drop any previous cookie
        res.clearCookie('stylist_token'); 
        //setting up new cookie 
        res.cookie('stylist_token', stylistToken, 
            {
                httpOnly : true,
                secure : process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax' ,
                maxAge : 10 * 60 * 1000
            })
        res.cookie('refresh_stylist_token', refreshToken, 
            {
                httpOnly : true,
                secure : process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
                maxAge : 24 * 60 * 1000
            })
        const apiEnd = performance.now() - apiStart
        console.log("Api stylist login result:", apiEnd + 'ms') 
        return res.status(200).json({message: `Welcome ${checkStylist[0].username}`})
    }catch(err){
        console.error('Error log in stylist', err)
        return res.status(500).json({
            message:"Error loggig in stylist", 
            err:err.stack})
    }
}
exports.changeStylistPassword = async(req, res)=>{
    try{
        const checkPasswordInput = await checkValidationResult(req)
        if(inputErcheckPasswordInputrors){
            return res.status(400).json({ 
                message: 'Please correct input errors',
                validationErrors: checkPasswordInput });
        }
        const {email, newPassword} = req.body
        const jwtOtpEmail = req.jwtOtp.email
        //validate jwtOtpEmail and email 
        if(jwtOtpEmail !== email){
            return res.status(401).json({message:'OTP verification required'})
        }
        //generate new password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt)
        const [checkIfPasswordUpdated] = await db.query("SELECT password_hash FROM stylists WHERE password_hash=?", [hashedPassword])
        if(checkIfPasswordUpdated.length > 0){
            return res.status(401).json("Password already updated")
        }
        await db.query(`
            UPDATE stylists 
            SET password_hash =? 
            WHERE email = ?`, 
            [hashedPassword, email])
        return res.status(201).json({message:"Passwword updated succesfully"})
    }catch(err){
     console.error("Error updating stylist password", err)
     return res.status(500).json({
        message:"Error updating stylist password", 
        err:err.stack})
    }
 }
exports.getStylistsUsername = async (req, res)=>{
    try{
        const stylistUsername = req.stylistUsername
        if(!stylistUsername) return res.status(401).json({message: 'Cannot tell you!'})
        const [getStylist] = await db.query(`SELECT username FROM stylists WHERE username = ?`,
            [stylistUsername])
        if(getStylist.length === 0){
            return res.status(401).json({message: 'Stylist username does not exist'})
        }
        return res.status(200).json({ username: getStylist[0].username });
    }catch(err){
        console.error('Error getting stylist username', err)
        return res.status(500).json({
            message:"Failed fetching stylist username", 
            err:err.stack})
    }
}
exports.stylistAppointment = async (req, res)=>{
    try{
        const stylistId = req.stylistId
        if(!stylistId) return res.status(401).json({message: "Sorry!, It's personal information"})
        const [checkStylist] = await db.query(`
            SELECT stylist_id
                FROM stylists
                WHERE stylist_id = ?`,
            [stylistId])
        if (checkStylist.length === 0){
            return res.status(401).json({message: 'Not a stylist'})
        }
        const [myAppointments] = await db.query(`
            SELECT 
                appointment_id AS appointmentId, 
                CONCAT(c.first_name, " ", c.last_name) AS customerName,
                c.username AS customerUsername, 
                serv.hair_style AS hairStyle, 
                DATE_FORMAT(appointment_date, '%Y-%m-%d') AS date,
                TIME_FORMAT(appointment_time, '%H:%i') AS time,
                status 
                FROM appointments 
                JOIN customers c USING(customer_id)
                JOIN services serv USING(service_id) 
                WHERE stylist_id = ?
                ORDER BY appointment_date DESC, appointment_time DESC`,
            [stylistId])
        if(myAppointments.length === 0){
            return res.status(200).json({message:`No appointment: ${myAppointments}`})
        }
        return res.status(200).json(myAppointments)
    }catch(error){
        console.error('Error getting stylist profile', error)
        return res.status(500).json({message:"Stylist profile error", error:error.stack})
    }
}
exports.stylistProfile = async (req,res)=>{
    try{
        const stylistId = req.stylistId
        if(!stylistId) return res.status(400).json({message: 'Not permitted'})
        const [getStylistsProfile] = await db.query(`
            SELECT 
                stylist_id, first_name, last_name, username, phone_number,
                    email, specialization
                FROM stylists
                WHERE stylist_id = ?`, [stylistId])
        if(getStylistsProfile.length === 0) 
            return res.status(404).json({message: 'No stylist record found'})
        return res.status(200).json(getStylistsProfile) 
    }catch(err){
        return res.status(500).json({
            message: 'Error accessing stylist profile', 
            err:err.stack})
    }
}
exports.logoutStylist = async (req, res)=>{
    try{
        const username = req.stylistUsername
        if(!username) return res.status(401).json({message: 'Not permitted'})
        res.clearCookie('stylist_token')
        res.clearCookie('refresh_stylist_token')
        return res.status(200).json({message:`Logout succesfully. Bye ${username}`})
    }catch(err){
        console.error('Error loggin out stylist', err)
        return res.status(500).json({
            message:"Error loggig out stylist", 
            err:err.stack})
    }
}
exports.viewStylists = async (req, res)=>{
    try{
        const [getStylists] = await db.query
        ("SELECT stylist_id, first_name, last_name, username, email, phone_number FROM stylists")
        return res.status(200).json(getStylists)   
    }catch(err){
        console.error("Getting stylists failed", err)
        return res.status(500).json({message:"Error fetching stylists", err:err.stack})
    }    
}
exports.updateStylistProfile = async (req, res)=>{
    try{
        const checkStylistUpdateInput = await checkValidationResult(req)
        if(checkStylistUpdateInput){
            return res.status(400).json({ 
                message: 'Please correct input errors', 
                validationErrors: checkStylistUpdateInput });
        }
        const stylistId = req.stylistId;
        const {
            updateFirstName, updateLastName,
            updateEmail, updatePhoneNumber, updateSpecialization  } = req.body
        const [queryStylist] = await db.query(`
            SELECT stylist_id, first_name FROM stylists WHERE stylist_id = ?`, [stylistId])
        if(!queryStylist || queryStylist.length === 0) return 'Invalid stylist'
        await db.query(`
            UPDATE stylists 
            SET first_name = ?, last_name = ?, email = ?,phone_number = ?, specialization = ?
            WHERE stylist_id = ?`, 
            [updateFirstName, updateLastName, updateEmail,updatePhoneNumber,updateSpecialization, stylistId])
        return res.status(200).json({message: `Data updated successfully`})
    }catch(err){
        console.log(`Error Updating stylist data: ${err.message}`)
        return res.status(500).json({message:`Failed to update stylist data`})
    }
}

// refresh token logic
exports.refreshJWTokens = async (req, res)=>{
    const adminId = req.adminId
    const userId = req.userId
    const stylistId = req.stylistId
    
    if(!adminId && !userId && !stylistId){
        return res.status(401).json({
            message: "Unathorized"})
    }
    try{
        if(adminId){
            const [checkAdmin] = await db.query(`
                SELECT admin_id, username, role
                FROM admins
                WHERE admin_id = ?`, [adminId])
            if(checkAdmin.length === 0){
                return res.status(404).json({message: "Admin not found"})
            }
            const adminUser = checkAdmin[0]
            const adminPayload = {
                adminId: adminUser.admin_id,
                adminUsername: adminUser.username,
                role: adminUser.role,
            }
            const newAdminToken = generateJWToken.accessToken(adminPayload)
            res.cookie('admin_token', newAdminToken, {
                httpOnly : true,
                secure : process.env.NDDE_ENV === 'production',
                sameSite : process.env.NDDE_ENV === 'production' ? "None" : "Lax",
                maxAge : 10 * 60 * 60
            })
        return res.status(200).json({message: "Refresh token successfully created"})
    }
        if(userId){
            const [checkCustomer] = await db.query(`SELECT customer_id, username FROM customers WHERE customer_id = ?`, [userId])
            if(checkCustomer.length === 0){
                return res.status(404).json({message: "Customer not found"})
            }
            const user = checkCustomer[0]
            const customerPayload = {
                userId:user.customer_id, 
                username:user.username,
            }
            const newCustomerToken = generateJWToken.accessToken(customerPayload)
            res.cookie('customer_token', newCustomerToken, {
                httpOnly : true,
                secure : process.env.NDDE_ENV === 'production',
                sameSite : process.env.NDDE_ENV === 'production' ? "None" : "Lax",
                maxAge : 10 * 60 * 60
            })
        return res.status(200).json({message: "Refresh token successfully created"})
        }
        if(stylistId){
            const [checkStylist] = await db.query(`
                SELECT stylist_id, username
                FROM stylists
                WHERE stylist_id = ?`, [stylistId])
            if(checkStylist.length === 0){
                return res.status(404).json({message: "Stylist not found"})
            }
            const stylistUser = checkStylist[0]
            const stylistPayload = {
                stylistId : stylistUser.stylist_id,
                stylistUsername : stylistUser.username,
            }
            const newStylistToken = generateJWToken.accessToken(stylistPayload)
            res.cookie('stylist_token', newStylistToken, {
                httpOnly : true,
                secure : process.env.NDDE_ENV === 'production',
                sameSite : process.env.NDDE_ENV === 'production' ? "None" : "Lax",
                maxAge : 10 * 60 * 60
            })
        return res.status(200).json({message: "Refresh token successfully created"})
        }
    }catch(error){
        console.log("Error encountered creating refresh token: ", error)
        return res.status(500).json({
            message : "Error generating refresh token",
            error : error.stack
        })
    } 
}
//appointments logic
exports.createAppointment = async (req, res) =>{
    try{
        const checkAppointmentInput = await checkValidationResult(req)
        if(checkAppointmentInput){
            return res.status(401).json({
                message:"Please fix error",
                validationErrors:checkAppointmentInput })
        }
        const customerUsername = req.username
        const {stylistUsername,hairStyle, appointmentDate, appointmentTime, status} = req.body
        const userId = req.userId
        const [queryCustomer] = await db.query('SELECT customer_id FROM customers WHERE customer_id = ?', [userId])
        
        const stylisUsername = req.stylistUsername
        const [queryStylist] = await db.query("SELECT stylist_id FROM stylists WHERE username = ?", [stylisUsername])
        if(queryStylist.length === 0){
            return res.status(401).json({message:"Invalid stylist username"})
        }
        const [queryService] = await db.query(`
            SELECT hair_style
                FROM services 
                WHERE hair_style = ?`, 
                [hairStyle]
        )
        if(queryService.length === 0){
            return res.status(401).json({message:"We don't offer this service, pase check the service menu."})
        }
        //check existing Ap for data integrity
        const apCheckValue = queryCustomer[0].customer_id
        const [checkAppointment] = await db.query(`
            SELECT appointment_id, customer_id, appointment_date 
                FROM 
                appointments 
                WHERE customer_id =? 
                AND appointment_date BETWEEN CURDATE() 
                AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)`,
            [apCheckValue]
        )
        if(checkAppointment.length > 0){
            return res.status(400).json({message:"Appointment already booked for the week"});
        }
        const [reviewAppointment] = await db.query(`
            SELECT stylist_id, appointment_date, appointment_time
                FROM appointments  
                WHERE appointment_date = ?
                AND appointment_time = ?`,
            [appointmentDate, appointmentTime])
        if(reviewAppointment.length > 0){
            return res.status(400).json(
                {message:'Appointment date and time occupied. Please reschedule'})
        }
        const [checkStylistSpec] = await db.query(`
            SELECT 
                username, specialization 
                FROM stylists 
                WHERE 
                username =? 
                AND FIND_IN_SET(?, REPLACE(specialization, ' ','')) > 0`, 
                [stylistUsername, hairStyle]
        )
        if(checkStylistSpec.length === 0){
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
            stylistUsername : stylisUsername,
            customerName : queryCustomer[0].first_name + ' ' + queryCustomer[0].last_name,
            customerUsername : queryCustomer[0].username,
            hairStyle : hairStyle,
            date : appointmentDate,
            time : appointmentTime,
            status : 'pending'
        }
        notifyStylist(stylistUsername, appointmentData)
        notifyCustomer(customerUsername, appointmentData)
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
                ORDER BY appointment_date DESC, appointment_time DESC
        `)
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
            return res.status(401).json({
                message:"Please fix error", 
                validationErrors: checkReviewInput })
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
        //appointment must be approved
        const [checkAppointment] = await db.query(`
            SELECT 
		            c.customer_id, s.hair_style, status
            FROM appointments
            JOIN customers c USING (customer_id)
            JOIN services s USING (service_id)
            WHERE s.hair_style = ?
                AND customer_id = ? 
                AND status = 'approved`, [hairStyle, userId])
        if(checkAppointment.length === 0){
            return res.status(404).json({
                message: `Either no appointment record, or it's not approved yet`})
        }
        const [queryService] = await db.query(`
            SELECT service_id 
                FROM services
                WHERE hair_style = ?`,
            [hairStyle])
        if(queryService.length === 0){
            res.status(401).json({message: 'Not a service you were offered'})
        }
        const [checkReview] = await db.query(`
            SELECT customer_id, service_id 
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
            return res.status(201).json({message: 'Review successfully created'})
    }catch(err){
        console.log("Error creating review", err)
        return res.status(500).json({
            message:'Creating review failed', 
            err:err.stack})
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
        return res.status(200).json(getReviews)
    }catch(err){
        console.log("Error fetching reviews", err)
        return res.status(500).json({
            message:'Fetching reviews failed', 
            err:err.stack})
    }
}
exports.sendOtp = async (req, res)=>{
    try{
        const checkOtpInput = await checkValidationResult(req)
        if(checkOtpInput){
            return res.status(401).json({
                message:"Please fix error", 
                validationErrors: checkOtpInput })
        }
        const {email} = req.body
        // hitting db in parallel with Promise
        const [adminRes, customerRes, stylistRes] = await Promise.all([
            db.query(`SELECT email FROM admins WHERE email = ?`, [email]),
            db.query(`SELECT email FROM customers WHERE email = ?`, [email]),
            db.query(`SELECT email FROM stylists WHERE email = ?`, [email])
        ])
        const [checkAdminEmail] = adminRes;
        const [checkCustomerEmail] = customerRes;
        const [checkStylistEmail] = stylistRes
        if (
                checkAdminEmail.length == 0 && 
                checkCustomerEmail.length == 0 && 
                checkStylistEmail.length == 0
            ) return res.status(401).json({message : 'Invalid email'})  
        // create four digits otp
        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        console.log(otp)
        const otpPayload = {
            otp : otp,
            email : email
        }
        await redis.del( `email:${email}`) // remove latee
        await redis.set(
            `email:${email}`,
            JSON.stringify(otpPayload),
            'EX',
            5 * 60 // 5mins
        )
        await sendOtpEmail(email, otp);
        return res.status(200).json({message:'OTP sent to your email'})
    }catch(err){
        console.log("Error occured while sending otp", err)
        return res.status(500).json({
            message: 'Sending otp error. Please check internet connection', 
            err:err.message
        })
    }
}
exports.verifyOtp = async (req, res) =>{
    try{
        const checkJwtOtpInput = await checkValidationResult(req)
        if(checkJwtOtpInput){
            return res.status(401).json({
                message:"Please fix error", 
                validationErrors:checkJwtOtpInput })
        }
        const { email, enteredOtp } = req.body
        let cachedOtp = await redis.get(`email:${email}`)
        let otp
        if(!cachedOtp){
            return res.status(401).json({message: 'OTP not recognized'})
        }
        if(cachedOtp){
            otp = JSON.parse(cachedOtp)
            console.log('retrieved otp', otp)
        }
        if(email !== otp.email) return res.status(401).json({
            message: " Email mismatch"})
        if(enteredOtp !== otp.otp) return res.status(401).json({
            message: "Invalid or expired OTP"})
        return res.status(200).json({message: 'OTP verification succesful'})
    }catch(err){
        console.log("Error occured validating otp", err)
        return res.status(500).json({
            message: 'OTP validation error', 
            err:err.stack})
    }
}