
const {check} = require("express-validator")

const today = new Date().toISOString().split("T")[0]; // removes time format from date

// validatio logic
const validateAppointment =
[
    check("appointmentDate", "Date cannot be in the past")
    .notEmpty().isAfter(today),
    check("appointmentTime", "Time field is required").notEmpty().isTime(),
]

const validateStylist =
[
    check("firstName", "FirstName is require").notEmpty().toLowerCase(),
    check("lastName", "LastName is require").notEmpty().toLowerCase(),
    check("username", "Username isrequire").notEmpty().toLowerCase(),
    check("email", "Must be a valid email").notEmpty().isEmail(),
    check("phoneNumber", "Enter phone number").notEmpty(),
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
    check("phoneNumber", "Enter phone number").notEmpty(),
    check("password", "Must contain letters and numbers and 6 or more characters long")
        .matches(/^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]+$/)
        .isLength({min:6})
]

const validateAdmin = 
[
    check("username", "Field is required").notEmpty().toLowerCase(),
    check("email", "Must be a valid email").notEmpty().isEmail(),
    check("phoneNumber", "Enter phone number").notEmpty(),
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

module.exports = 
{
    validateAppointment, validateStylist, validateCustomer,
    validateAdmin, validateReview

}