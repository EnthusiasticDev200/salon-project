require('dotenv').config()
const jwt = require('jsonwebtoken')


const generateJWToken = {
    accessToken : function(payload){
        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {
                "algorithm": 'HS256',
                'expiresIn' : '2m'       // change back to 10mins
            }      
        )
        return token
    },
    refreshToken : function(payload){
        const newToken = jwt.sign(
            payload,
            process.env.REFRESH_JWT_SECRET,
            {
                "algorithm": 'HS256',
                'expiresIn' : '24h'
            } 
        )
        return newToken
    }
}

module.exports = generateJWToken