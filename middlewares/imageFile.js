const multer = require('multer')



const imageMidware = async(req, res, next) =>{
    try{
        const upload = multer({dest : 'uploads/'})

        upload.single('images')
    
        next()
    }catch(err){
        console.log("Error validating images", err)
        return res.status(500).json({
            message : "image validation error ",
            error : err.stack
        })
    }
}


module.exports = imageMidware

