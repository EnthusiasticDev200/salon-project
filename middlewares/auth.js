const jwt = require("jsonwebtoken")
require('dotenv').config();


const authenticateJWT = (req, res, next)=>{
    const adminToken = req.cookies.admin_token
    const customerToken = req.cookies.customer_token
    const stylistToken = req.cookies.stylist_token

    let decoded;
    if(adminToken){
       try{
            decoded = jwt.verify(adminToken, process.env.JWT_SECRET, {
                'algorithms' : [`HS256`]
            })
            req.adminId = decoded.adminId || null;
            req.adminUsername = decoded.adminUsername || null
            req.role = decoded.role || null 
       }catch(error){
            console.warn("Invalid token")
       }
    }
    if(customerToken){
        try{
            decoded = jwt.verify(customerToken, process.env.JWT_SECRET, {
                'algorithms' : [`HS256`]
            })
            req.userId = decoded.userId || null;
            req.username = decoded.username || null; 
        }catch(error){
            console.warn("Invalid token")
        }
    }
    if(stylistToken){
        try{
            decoded = jwt.verify(stylistToken, process.env.JWT_SECRET, {
                'algorithms' : [`HS256`]
            })
            req.stylistId = decoded.stylistId || null;
            req.stylistUsername = decoded.stylistUsername || null; 
        }catch(error){
            console.warn("Invalid token")
        }
    }

    if (!req.userId || !req.stylistId || !req.adminId) {
        return res.status(401).json({ message: 'Unauthorized. Expired or invalid token!' });
    }
    next()
}

const validateRefreshJWToken = (req, res, next)=>{
    const refreshToken = req.cookies.refresh_admin_token || req.cookies.refresh_customer_token || req.cookies.refresh_stylist_token
    if( !refreshToken ){
        return res.status(401).json({message: "No refresh token found"})
    }
    try{
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET,{
                algorithms: ['HS256']
            })
        if(decoded.adminId){
                req.adminId = decoded.adminId || null
            }
        else if(decoded.userId){
                req.userId = decoded.userId || null
            }
        else if (decoded.stylistId) {
                req.stylistId = decoded.stylistId || null
        }   
        
        if(!req.adminId && !req.userId && !req.stylistId){
            return res.status(403).json({message: "Invalid or expired refresh token"})
        }
        next()
    }catch(error){
         console.log("Error validating refresh token: ", error)
        return res.status(500).json({
            message:"Refresh token validation error",
            error: error.stack
        })
    }
}

const requireSuperuser = (req, res, next)=>{
   
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
    authenticateJWT, validateRefreshJWToken,
    requireSuperuser, verifyOtp, customerOnly
    } //using named export