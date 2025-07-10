const express = require('express')
const {authenticateJWT, requireSuperuser, verifyOtp} = require('../../middlewares/auth')
const router = express.Router()
// const {check} = require("express-validator")
const 
{
    validateAppointment, validateStylist,
    validateCustomer,
    validateAdmin,
    validateReview

} = require("../../middlewares/validations")


const
{
    adminTable,registerAdmin, logInAdmin,logoutAdmin,changeAdminPassword,
    customerTable, registerCustomer, logInCustomer, CustomerProfile,logoutCustomer,
    viewCustomers,getCustomerUsername, changeCustomerPassword,
    stylistTable, registerStylist,loginStylist, logoutStylist,viewStylists,
    getStylistsUsername, stylistProfile, changeStylistPassword,
    serviceTable,createServices,viewServices,
    appointmentTable, createAppointment, viewAppointments,
    reviewTable, createReview,viewReviews,
    sendOtp, validateJwtOtp,

    
} = require('../authController')


// authenticateJWT used to be here but now moved to expree.js


//creating tables endpoints
router.get('/admins/table', authenticateJWT, requireSuperuser, adminTable)
router.get('/customers/table',  authenticateJWT, requireSuperuser, customerTable)
router.get('/stylists/table',  authenticateJWT, requireSuperuser, stylistTable)
router.get('/services/table',  authenticateJWT, requireSuperuser, serviceTable)
router.get('/appointments/table',  authenticateJWT, requireSuperuser, appointmentTable)
router.get('/reviews/table', authenticateJWT, requireSuperuser, reviewTable)

//admin's endpoints 
router.post('/admin/register', validateAdmin, registerAdmin)
router.post('/admin/login',logInAdmin)
router.get("/admin/logout", logoutAdmin)
router.put('/admin/updatepassword',verifyOtp, changeAdminPassword)

//customer's endpoints
router.post('/customer/register', validateCustomer,registerCustomer)
router.post('/customer/login',logInCustomer)
router.put('/customer/updatepassword',verifyOtp, changeCustomerPassword)

//customer's protected routes
router.get('/customer/me', authenticateJWT, getCustomerUsername)
router.get("/customer/profile", authenticateJWT, CustomerProfile) 
router.get('/customer/profile/logout', authenticateJWT,logoutCustomer)
router.get('/customer/view', authenticateJWT,requireSuperuser, viewCustomers)

//service's endpoint
router.post('/service/create', authenticateJWT, requireSuperuser,createServices) // 
router.get('/service/view',viewServices)

// stylist endpoint 
router.post('/stylist/register', validateStylist,registerStylist)
router.post('/stylist/login',loginStylist)
router.put('/stylist/updatepassword',verifyOtp, changeStylistPassword)
router.get("/stylist/profile", authenticateJWT, stylistProfile)
router.get('/stylist/me', authenticateJWT,getStylistsUsername)
router.get('/stylist/logout', authenticateJWT,logoutStylist)
router.get('/stylist/view', authenticateJWT, viewStylists)

//appointment endpoint
router.post('/appointment/create', validateAppointment,authenticateJWT, createAppointment)
router.get('/appointment/view', authenticateJWT, requireSuperuser,viewAppointments)

//review endpoint
router.post('/review/create', validateReview, authenticateJWT, createReview)
router.get("/review/view", viewReviews)

//otp enspoint
router.post('/otp/send', sendOtp)
router.post('/otp/verify', verifyOtp, validateJwtOtp)

module.exports = router