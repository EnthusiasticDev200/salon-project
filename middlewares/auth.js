const jwt = require("jsonwebtoken")
require('dotenv').config();


const authenticateJWT = (req, res, next)=>{
    const adminToken = req.cookies.admin_token
    const customerToken = req.cookies.customer_token
    const stylistToken = req.cookies.stylist_token
    
    let decoded;

    if(adminToken){
       try{
            decoded = jwt.verify(adminToken, process.env.JWT_SECRET)
            req.adminId = decoded.adminId || null;
            req.adminUsername = decoded.adminUsername || null
            req.role = decoded.role || null
       }catch(error){
            console.warn("Invalid token")
       }
    }
    if(customerToken){
        try{
            decoded = jwt.verify(customerToken, process.env.JWT_SECRET)
            req.userId = decoded.userId || null;
            req.username = decoded.username || null;
        }catch(error){
            console.warn("Invalid token")
        }
    }
    if(stylistToken){
        try{
            decoded = jwt.verify(stylistToken, process.env.JWT_SECRET)
            req.stylistId = decoded.stylistId || null;
            req.stylistUsername = decoded.stylistUsername || null;
        }catch(error){
            console.warn("Invalid token")
        }
    }

    // if not user, ctylist and admin
    if (!req.userId && !req.stylistId && !req.adminId) {
        return res.status(401).json({ message: 'Access denied. Unauthorized!' });
    }
    next();  
}
const requireSuperuser = async(req, res, next)=>{
   
    if(req.role !== "superuser") return res.status(403).json({message:"Restricted route for superuser"})

    next();
}


module.exports = {authenticateJWT ,requireSuperuser} //using named export