const {check} = require("express-validator");

const validateAppointment =
[   
    check("stylistUsername", "stylistUsername field is require").notEmpty().toLowerCase(),
    check("hairStyle", "hairStyle field is require").notEmpty().toLowerCase(),
    check("appointmentDate", "Appointmnet date is required")
    .notEmpty()
    .isISO8601()
    .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage("Date must be in 'YYYY-MM-DD' format" )
    .custom((value)=>{
        const scheduleDate = new Date(value)
        const present = new Date ()

        //Nullify time(H:M,S,Ms) from Date instances
        scheduleDate.setHours(0,0,0,0)
        present.setHours(0,0,0,0)

        if(scheduleDate < present){
            throw new Error("Appointment date cannot be in the past")
        }
        // appointment must span 3months
        const appointmentSpan = new Date()
        appointmentSpan.setMonth(appointmentSpan.getMonth() + 3)

        if(scheduleDate > appointmentSpan){
            throw new Error('Appointment date cannot exceed three months from today' )
        }
        return true
    }),
    check("appointmentTime", "Time field is required")
    .notEmpty()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/) // HH:mm format regex,,
    //ensure time is not past logic
    .custom((value, {req})=>{
        const appointmentDate = req.body.appointmentDate
        
        const present = new Date()
        const presentDate = present.toISOString().split('T')[0] // without time
        
        const scheduleDateTime = new Date(`${appointmentDate}T${value}`)
        
        const [hours, minutes] = value.split(':').map(Number)
        //opening and closing hours
        const openingHour = 8 // 8AM
        const closingHour = 21 //9PM
        
        if(hours < openingHour || (hours > closingHour || (hours === closingHour && minutes > 0))){
            throw new Error ("Appointment must be within 8AM and 9PM (21:00)")
        }
        if(appointmentDate === presentDate && scheduleDateTime < present){
            throw new Error('Time caanot be in the past')
        }
        
        return true
    })
]

const validateStylist =
[
    check("firstName", "FirstName is require").notEmpty().toLowerCase(),
    check("lastName", "LastName is require").notEmpty().toLowerCase(),
    check("username", "Username isrequire").notEmpty().toLowerCase(),
    check("email", "Must be a valid email").notEmpty().isEmail(),
    check("phoneNumber", "Phone number is required")
    .notEmpty()
    .matches(/^\+?\d{10,15}$/) // length 10-15 and accepts country code
    .withMessage("Phone number must be 10 to 15 digits, and may start with '+'"),
    check("password", "Password must contain at least one upper and lowercase, symbol and number")
        .notEmpty()
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s])[A-Za-z\d\W]+$/
)
        .isLength({min:6}),
    check("specialization", "Field is required").not().isEmpty().toLowerCase()
]

const validateCustomer =
[
    check("firstName", "First name is require").notEmpty().toLowerCase(),
    check("lastName", "Last name is require").notEmpty().toLowerCase(),
    check("username", "Username isrequire").notEmpty().toLowerCase(),
    check("email", "Must be a valid email").notEmpty().isEmail(),
    check("phoneNumber", "Phone number is required")
    .notEmpty()
    .matches(/^\+?\d{10,15}$/) // length 10-15 and accepts country code
    .withMessage("Letters not allowed in phone number, but may start with '+'"),
     check("password", "Password must contain at least one upper and lowercase, symbol and number")
        .notEmpty()
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s])[A-Za-z\d\W]+$/
)
        .isLength({min:6})
]

const validateLoginAndChangePassword = 
[
    check("email", "Must be a valid email").notEmpty().isEmail(),
   check("newPassword")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s])[A-Za-z\d\W]+$/
)
    .withMessage("Password must contain at least one upper and lowercase, symbol and number")
]

const validateAdmin = 
[
    check("username", "Field is required").notEmpty().toLowerCase(),
    check("email", "Must be a valid email").notEmpty().isEmail(),
    check("phoneNumber", "Phone number is required")
    .notEmpty()
    .matches(/^\+?\d{10,15}$/) // length 10-15 and accepts country code
    .withMessage("Phone number must be 10 to 15 digits, and may start with '+'"),
    check("role", "Field is required").notEmpty().toLowerCase(),
     check("password", "Password must contain at least one upper and lowercase, symbol and number")
        .notEmpty()
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s])[A-Za-z\d\W]+$/
)
        .isLength({min:6})
]

const validateAdminProfileUpdate = [
    check("updateEmail", "Must be a valid email").notEmpty().isEmail(),
    check("updatePhoneNumber", "Phone number is required")
    .notEmpty()
    .matches(/^\+?\d{10,15}$/) // length 10-15 and accepts country code
    .withMessage("Phone number must be 10 to 15 digits, and may start with '+'"),
]
const validateReview = 
[
    check("hairStyle", "Hair style is required").notEmpty().toLowerCase(),
    check("rating", "Rating must be greater than 0 and less than 6").notEmpty().isInt({min: 1, max:5}),
    check("feedback", "Feedback is required").notEmpty().toLowerCase()
]

const validateEmail = 
[
    check("email", "Must be a valid email").notEmpty().isEmail(),
]

const validateOtp = 
[
    check('enteredOtp')
    .notEmpty().withMessage('OTP is required')
    .matches(/^\d{6}$/).withMessage("Wrong OTP") // ensures digits (0-9) no symbols or alpha
    .isLength({min:6, max:6})
    .withMessage("Unrecongized OTP") 
]

const validateService = 
[
    check("hairStyle", "Hair style is required").notEmpty().toLowerCase(),
    check('price', 'Price field id required')
    .notEmpty()
    .isInt({min:2000, max:10000})
    .withMessage("Price must be within 2,000 - 10, 000")
    
]

const validateCustomerUpdate = 
[
    check('updateFirstName', 'Field is required').notEmpty().toLowerCase(),
    check('updateLastName', 'Field required').notEmpty().toLowerCase(),
    check("updateEmail", "Must be a valid email").notEmpty().isEmail(),
    check("updatePhoneNumber", "Phone number is required")
    .notEmpty()
    .matches(/^\+?\d{10,15}$/) // length 10-15 and accepts country code
    .withMessage("Phone number must be 10 to 15 digits, and may start with '+'"),
]  
const validateStylistUpdate = 
[
    check('updateFirstName', 'Field is required').notEmpty().toLowerCase(),
    check('updateLastName', 'Field required').notEmpty().toLowerCase(),
    check("updateEmail", "Must be a valid email").notEmpty().isEmail(),
    check("updatePhoneNumber", "Phone number is required")
    .notEmpty()
    .matches(/^\+?\d{10,15}$/) // length 10-15 and accepts country code
    .withMessage("Phone number must be 10 to 15 digits, and may start with '+'"),
    check('updateSpecialization', 'Field is required').notEmpty().toLowerCase(),
]   
module.exports = 
{
    validateAppointment, validateLoginAndChangePassword, 
    validateEmail,validateOtp, validateService,
    validateStylist, validateStylistUpdate,
    validateCustomer, validateCustomerUpdate,
    validateAdmin, validateReview, validateAdminProfileUpdate

}