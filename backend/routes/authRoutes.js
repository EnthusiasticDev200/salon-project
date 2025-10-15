const express = require('express')
const router = express.Router()

const
{ 
    authenticateJWT, requireSuperuser, customerOnly, 
    stylistOnly, validateRefreshJWToken, adminOnly 
} = require('../../middlewares/auth')

const {strictLimiter, mildLimiter} = require('../../middlewares/rateLimiter')

const 
{
    validateAppointment, validateLoginAndChangePassword, validateEmail, 
    validateOtp, validateService, validateStylist, validateCustomer, validateCustomerUpdate,
    validateAdmin, validateReview, validateStylistUpdate, validateAdminProfileUpdate
} = require("../../middlewares/validations")

const
{
    registerAdmin, logInAdmin,logoutAdmin,changeAdminPassword,

    registerCustomer, logInCustomer, customerProfile,logoutCustomer,
    viewCustomers,getCustomerUsername, changeCustomerPassword,customerAppointment,
    updateCustomerProfile,

    registerStylist,loginStylist, logoutStylist,viewStylists,
    getStylistsUsername, stylistProfile, changeStylistPassword, stylistAppointment,
    updateStylistProfile,

    createServices,viewServices,
    createAppointment, viewAppointments,
    createReview,viewReviews,
    sendOtp, verifyOtp,
    refreshAdminJWTokens, refreshCustomerJWTokens, refreshStylistJWTokens,
    updateAdminProfile, adminProfile
    
} = require('../authController')

//admin's endpoints 
router.post('/admin/register', strictLimiter ,validateAdmin, registerAdmin)
router.post('/admin/login',strictLimiter,logInAdmin)
router.post("/admin/logout", mildLimiter,authenticateJWT,logoutAdmin)
router.put('/admin/updatepassword', strictLimiter, validateLoginAndChangePassword, changeAdminPassword)
router.patch('/admin/updateprofile', strictLimiter, validateAdminProfileUpdate, authenticateJWT, updateAdminProfile)
router.get('/admin/profile', strictLimiter, authenticateJWT, adminOnly, adminProfile)
//customer's endpoints
router.post('/customer/register', strictLimiter, validateCustomer,registerCustomer)
router.post('/customer/login',strictLimiter,logInCustomer)
router.put('/customer/updatepassword', strictLimiter,validateLoginAndChangePassword, changeCustomerPassword)

//customer's protected routes
router.get('/customer/me', mildLimiter,authenticateJWT,customerOnly, getCustomerUsername)
router.patch('/customer/profile/update', strictLimiter,validateCustomerUpdate, authenticateJWT, customerOnly, updateCustomerProfile)
router.get('/customer/profile', mildLimiter,authenticateJWT, customerOnly, customerProfile)
router.get("/customer/appointment", mildLimiter,authenticateJWT, customerOnly, customerAppointment) 
router.post('/customer/profile/logout', mildLimiter,authenticateJWT, customerOnly, logoutCustomer)
router.get('/customer/view', mildLimiter,authenticateJWT,requireSuperuser, viewCustomers)

//service's endpoint
router.post('/service/create', strictLimiter,validateService, authenticateJWT, requireSuperuser,createServices)
router.get('/service/view',mildLimiter,viewServices)

// stylist endpoint 
router.post('/stylist/register', strictLimiter,validateStylist,registerStylist)
router.post('/stylist/login',strictLimiter,loginStylist)
router.put('/stylist/updatepassword',strictLimiter, validateLoginAndChangePassword, changeStylistPassword)

router.get("/stylist/profile", mildLimiter, authenticateJWT, stylistOnly, stylistProfile)
router.get("/stylist/appointment",mildLimiter, authenticateJWT, stylistOnly, stylistAppointment)
router.get('/stylist/me', mildLimiter,authenticateJWT,stylistOnly,getStylistsUsername)
router.post('/stylist/logout', mildLimiter,authenticateJWT,stylistOnly, logoutStylist)
router.get('/stylist/view',mildLimiter, authenticateJWT, viewStylists)
router.patch('/stylist/profile/update', strictLimiter,validateStylistUpdate, authenticateJWT, stylistOnly, updateStylistProfile)


// refresh token endpoint for admin
router.post('/admin/token/refresh', mildLimiter, validateRefreshJWToken, refreshAdminJWTokens )

router.post('/customer/token/refresh', mildLimiter, validateRefreshJWToken, refreshCustomerJWTokens )

router.post('/stylist/token/refresh', mildLimiter, validateRefreshJWToken, refreshStylistJWTokens )

//appointment endpoint
router.post('/appointment/create', strictLimiter, validateAppointment,authenticateJWT, createAppointment)
router.get('/appointment/view', mildLimiter,authenticateJWT, requireSuperuser,viewAppointments)

//review endpoint
router.post('/review/create', strictLimiter, validateReview, authenticateJWT, customerOnly ,createReview)
router.get("/review/view", mildLimiter, viewReviews)

//otp enspoint
router.post('/otp/send', strictLimiter,validateEmail,sendOtp)
router.post('/otp/verify', strictLimiter, validateOtp, verifyOtp)

module.exports = router