const express = require('express')
const {authenticateJWT, requireSuperuser, verifyOtp, customerOnly} = require('../../middlewares/auth')
const router = express.Router()
// const {check} = require("express-validator")
const 
{
    validateAppointment, validateLoginAndChangePassword, validateEmail, 
    validateOtp, validateService,
    validateStylist,
    validateCustomer, validateCustomerUpdate,
    validateAdmin,
    validateReview

} = require("../../middlewares/validations")


const
{
    registerAdmin, logInAdmin,logoutAdmin,changeAdminPassword,

    registerCustomer, logInCustomer, customerProfile,logoutCustomer,
    viewCustomers,getCustomerUsername, changeCustomerPassword,CustomerAppointment,
    updateCustomerProfile,

    registerStylist,loginStylist, logoutStylist,viewStylists,
    getStylistsUsername, stylistProfile, changeStylistPassword, stylistAppointment,

    createServices,viewServices,
    createAppointment, viewAppointments,
    createReview,viewReviews,
    sendOtp, validateJwtOtp,
    
} = require('../authController')


// authenticateJWT used to be here but now moved to expree.js


//admin's endpoints 
router.post('/admin/register', validateAdmin, registerAdmin)
router.post('/admin/login',logInAdmin)
router.get("/admin/logout", logoutAdmin)
router.put('/admin/updatepassword', validateLoginAndChangePassword, verifyOtp, changeAdminPassword)

//customer's endpoints
router.post('/customer/register', validateCustomer,registerCustomer)
router.post('/customer/login',logInCustomer)
router.put('/customer/updatepassword', validateLoginAndChangePassword, verifyOtp, changeCustomerPassword)

//customer's protected routes
router.get('/customer/me', authenticateJWT, getCustomerUsername)
router.patch('/customer/profile/update', validateCustomerUpdate, authenticateJWT, updateCustomerProfile)
router.get('/customer/profile', authenticateJWT, customerProfile)
router.get("/customer/appointment", authenticateJWT, CustomerAppointment) //changed cusProfile to cusApp
router.get('/customer/profile/logout', authenticateJWT,logoutCustomer)
router.get('/customer/view', authenticateJWT,requireSuperuser, viewCustomers)

//service's endpoint
router.post('/service/create', validateService, authenticateJWT, requireSuperuser,createServices) // 
router.get('/service/view',viewServices)

// stylist endpoint 
router.post('/stylist/register', validateStylist,registerStylist)
router.post('/stylist/login',loginStylist)
router.put('/stylist/updatepassword',validateLoginAndChangePassword, verifyOtp, changeStylistPassword)

//router.get("/stylist/profile", authenticateJWT, stylistProfile)
router.get("/stylist/appointment", authenticateJWT, stylistAppointment)
router.get('/stylist/me', authenticateJWT,getStylistsUsername)
router.get('/stylist/logout', authenticateJWT,logoutStylist)
router.get('/stylist/view', authenticateJWT, requireSuperuser, viewStylists)

//appointment endpoint
router.post('/appointment/create', validateAppointment,authenticateJWT, createAppointment)
router.get('/appointment/view', authenticateJWT, requireSuperuser,viewAppointments)

//review endpoint
router.post('/review/create', validateReview, authenticateJWT, customerOnly ,createReview)
router.get("/review/view", viewReviews)

//otp enspoint
router.post('/otp/send', validateEmail,sendOtp)
router.post('/otp/verify', validateOtp, verifyOtp, validateJwtOtp)

module.exports = router