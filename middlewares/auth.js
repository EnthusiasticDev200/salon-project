const jwt = require("jsonwebtoken")
require('dotenv').config();


const authenticateJWT = (req, res, next)=>{
    const token = req.cookies.token // suspecting cookie error on this line
    if(!token) {
        return res.status(401).json({message:'Access denied. Unathourised!'})
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded)=>{
        if(err) return res.status(403).json({message:'Invalid or expired token'});

        req.userId = decoded.userId;
        req.adminId = decoded.adminId;
        req.stylistId = decoded.stylistId
        console.log('admin Id is: ',req.adminId);
        console.log('req userId',req.userId);
        console.log('req stylistId',req.stylistId);
        

        req.username = decoded.username // dont use admin username toavoid code comflict
        console.log("whose username: ", req.username)

        req.role = decoded.role
        console.log('admin role',req.role);
        next();
    })
}


const requireSuperuser = async(req, res, next)=>{
   
    if(req.role !== "superuser") return res.status(403).json({message:"Restricted route for superuser"})

    next();
}


module.exports = {authenticateJWT ,requireSuperuser} //using named export