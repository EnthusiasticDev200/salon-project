const express = require('express')
const {authenticateJWT, requireSuperuser, verifyOtp, customerOnly} = require('../../middlewares/auth')
const router = express.Router()
const {strictLimiter, mildLimiter} = require('../../middlewares/rateLimiter')
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

//admin's endpoints 
router.post('/admin/register', strictLimiter ,validateAdmin, registerAdmin)
router.post('/admin/login',strictLimiter,logInAdmin)
router.get("/admin/logout", mildLimiter,authenticateJWT,logoutAdmin)
router.put('/admin/updatepassword', strictLimiter, validateLoginAndChangePassword,verifyOtp, changeAdminPassword)

//customer's endpoints
router.post('/customer/register', strictLimiter, validateCustomer,registerCustomer)
router.post('/customer/login',strictLimiter,logInCustomer)
router.put('/customer/updatepassword', strictLimiter,validateLoginAndChangePassword, verifyOtp, changeCustomerPassword)

//customer's protected routes
router.get('/customer/me', mildLimiter,authenticateJWT, getCustomerUsername)
router.patch('/customer/profile/update', strictLimiter,validateCustomerUpdate, authenticateJWT, updateCustomerProfile)
router.get('/customer/profile', mildLimiter,authenticateJWT, customerProfile)
router.get("/customer/appointment", mildLimiter,authenticateJWT, CustomerAppointment) 
router.get('/customer/profile/logout', mildLimiter,authenticateJWT,logoutCustomer)
router.get('/customer/view', mildLimiter,authenticateJWT,requireSuperuser, viewCustomers)

//service's endpoint
router.post('/service/create', strictLimiter,validateService, authenticateJWT, requireSuperuser,createServices)
router.get('/service/view',mildLimiter,viewServices)

// stylist endpoint 
router.post('/stylist/register', strictLimiter,validateStylist,registerStylist)
router.post('/stylist/login',strictLimiter,loginStylist)
router.put('/stylist/updatepassword',strictLimiter, validateLoginAndChangePassword, verifyOtp, changeStylistPassword)

router.get("/stylist/profile", mildLimiter, authenticateJWT, stylistProfile)
router.get("/stylist/appointment",mildLimiter, authenticateJWT, stylistAppointment)
router.get('/stylist/me', mildLimiter,authenticateJWT,getStylistsUsername)
router.get('/stylist/logout', mildLimiter,authenticateJWT,logoutStylist)
router.get('/stylist/view',mildLimiter, authenticateJWT, viewStylists)

//appointment endpoint
router.post('/appointment/create', strictLimiter, validateAppointment,authenticateJWT, createAppointment)
router.get('/appointment/view', mildLimiter,authenticateJWT, requireSuperuser,viewAppointments)

//review endpoint
router.post('/review/create', strictLimiter, validateReview, authenticateJWT, customerOnly ,createReview)
router.get("/review/view", mildLimiter, viewReviews)

//otp enspoint
router.post('/otp/send', strictLimiter,validateEmail,sendOtp)
router.post('/otp/verify', strictLimiter, validateOtp, verifyOtp, validateJwtOtp)

module.exports = router