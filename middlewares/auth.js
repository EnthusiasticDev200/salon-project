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

    if (!req.userId && !req.stylistId && !req.adminId) {
        return res.status(401).json({ message: 'Unauthorized. Expired or invalid token!' });
    }
    next()
}

const validateRefreshJWToken = (req, res, next)=>{
    const refreshAdminToken = req.cookies.refresh_admin_token
    const refreshCustomerToken = req.cookies.refresh_customer_token
    const refreshStylistToken = req.cookies.refresh_stylist_token
    
    if( !refreshAdminToken && !refreshCustomerToken && !refreshStylistToken ){
        return res.status(401).json({message: "No refresh token found"})
    }
    try{
        if(refreshAdminToken){
            const decoded = jwt.verify(refreshAdminToken, process.env.REFRESH_JWT_SECRET,{
                algorithms: ['HS256']
            })
            req.adminId = decoded.adminId || null
        }
        if(refreshCustomerToken){
            const decoded = jwt.verify(refreshCustomerToken, process.env.REFRESH_JWT_SECRET,{
                algorithms: ['HS256']
            })
            req.userId = decoded.userId || null
        }
         if(refreshStylistToken){
            const decoded = jwt.verify(refreshStylistToken, process.env.REFRESH_JWT_SECRET,{
                algorithms: ['HS256']
            })
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

module.exports = {
    authenticateJWT, validateRefreshJWToken,
    requireSuperuser, customerOnly
    } //using named export