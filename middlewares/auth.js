const jwt = require("jsonwebtoken")
require('dotenv').config();


const authenticateJWT = (req, res, next)=>{
    const adminToken = req.cookies.admin_token
    const customerToken = req.cookies.customer_token
    const stylistToken = req.cookies.stylist_token

    if(adminToken){
       try{
            const decoded = jwt.verify(adminToken, process.env.JWT_SECRET)
            req.adminId = decoded.adminId || null;
            req.adminUsername = decoded.adminUsername || null
            req.role = decoded.role || null
            return next() 
       }catch(error){
            console.warn("Invalid token")
       }
    }
    if(customerToken){
        try{
            const decoded = jwt.verify(customerToken, process.env.JWT_SECRET)
            req.userId = decoded.userId || null;
            req.username = decoded.username || null;
            return next() 
        }catch(error){
            console.warn("Invalid token")
        }
    }
    if(stylistToken){
        try{
            const decoded = jwt.verify(stylistToken, process.env.JWT_SECRET)
            req.stylistId = decoded.stylistId || null;
            req.stylistUsername = decoded.stylistUsername || null;
            return next() 
        }catch(error){
            console.warn("Invalid token")
        }
    }

    // if not user, stylist and admin
    if (!req.userId && !req.stylistId && !req.adminId) {
        return res.status(401).json({ message: 'Access denied. Unauthorized!' });
    }
    next();  
}
const requireSuperuser = async(req, res, next)=>{
   
    if(req.role !== "superuser") return res.status(403).json({message:"Restricted route for superuser"})

    next();
}
const customerOnly = async (req, res, next)=>{
    if (!req.userId) return res.status(403).json({message:" Sorry! Strictly for customers"})
    next()
}
const verifyOtp = async (req, res,next) =>{
    try{
        const jwtOtp = req.cookies.jwtOtp
        if(!jwtOtp) return res.status(401).json({message: 'No OTP token fond'})
        const decoded = jwt.verify(jwtOtp, process.env.JWT_SECRET)
        req.jwtOtp = decoded;
        next() 
    }catch(error){
        console.log('OTP verification failed', error)
        return res.status(500).json({message: 'Invalid or Expired OTP token'})
    }
   
}


module.exports = {
    authenticateJWT ,requireSuperuser, verifyOtp,
    customerOnly
    } //using named export