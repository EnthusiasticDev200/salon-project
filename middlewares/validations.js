
const {check} = require("express-validator")

const today = new Date().toISOString().split("T")[0]; // removes time format from date

// validatio logic
const validateAppointment =
[   
    check("stylistUsername", "stylistUsername field is require").notEmpty().toLowerCase(),
    check("hairStyle", "hairStyle field is require").notEmpty().toLowerCase(),
    check("appointmentDate", "Date cannot be in the past")
    .notEmpty()
    .custom((value)=>{
        return value >=today // ensures present to future time but not past
    }),
    check("appointmentTime", "Time field is required")
    .notEmpty()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/) // HH:mm format regex,,
    //ensure time is not past logic
    .custom((value, {req})=>{
        const appointmentDate = req.body.appointmentDate
        const now = new Date()
        const selectedDateTime = new Date(`${appointmentDate}T${value}`)// create valid JS Date obj
        if(appointmentDate === today && selectedDateTime < now){
            throw new Error ('Time caannot be in the past')
        } return true
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
    check("password", "Must contain letters, numbers and 6 or more characters long")
        .notEmpty()
        .matches(/^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]+$/)
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
    check("password", "Must contain letters and numbers and 6 or more characters long")
        .matches(/^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]+$/)
        .isLength({min:6})
]

const validateLoginAndChangePassword = 
[
    check("email", "Must be a valid email").notEmpty().isEmail(),
   check("newPassword")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*[a-zA-Z])(?=.*\d).*$/)
    .withMessage("Password must contain at least one letter and one number")
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
    check("password", "Must contain letters,numbers and at least 6 or more characters")
        .notEmpty()
        .matches(/^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]+$/)
        .isLength({min:6})
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
    .matches(/^\d{4}$/).withMessage("Wrong OTP") // ensures digits (0-9) no symbols or alpha
    .isLength({min:4, max:4})
    .withMessage("Beyond expected number required") 
]

const validateService = 
[
    check("hairStyle", "Hair style is required").notEmpty().toLowerCase(),
    check('price', 'Price field id required').notEmpty().isInt()
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
module.exports = 
{
    validateAppointment, validateLoginAndChangePassword, 
    validateEmail,validateOtp, validateService,
    validateStylist, 
    validateCustomer, validateCustomerUpdate,
    validateAdmin, validateReview

}