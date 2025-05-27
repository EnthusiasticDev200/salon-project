const express = require('express')
const {authenticateJWT, requireSuperuser} = require('../../middlewares/auth')
const router = express.Router()
// const {check} = require("express-validator")
const 
{
    validateAppointment, validateStylist,
    validateCustomer,
    validateAdmin,

} = require("../../middlewares/validations")


const
{
    adminTable,registerAdmin, logInAdmin,logoutAdmin,changeAdminPassword,
    customerTable, registerCustomer, logInCustomer, getCustomerProfile,logoutCustomer,
    stylistTable, registerStylist,loginStylist, logoutStylist,
    serviceTable,createServices,viewServices,
    appointmentTable, createAppointment,
    
} = require('../authController')


// authenticateJWT used to be here but now moved to expree.js


//creating tables endpoints
router.get('/admins/table', authenticateJWT, requireSuperuser, adminTable)
router.get('/customers/table',  authenticateJWT, requireSuperuser, customerTable)
router.get('/stylists/table',  authenticateJWT, requireSuperuser, stylistTable)
router.get('/services/table',  authenticateJWT, requireSuperuser, serviceTable)
router.get('/appointments/table',  authenticateJWT, requireSuperuser, appointmentTable)

//admin's endpoints 
router.post('/admin/register', validateAdmin, registerAdmin)
router.post('/admin/login',logInAdmin)
router.get("/admin/logout", logoutAdmin)
router.put('/admin/updatepassword',changeAdminPassword)

//customer's endpoints
router.post('/customer/register', validateCustomer,registerCustomer)
router.post('/customer/login',logInCustomer)
//customer's protected routes
router.get("/customer/login/profile", authenticateJWT, getCustomerProfile) 
router.get('/customer/profile/logout', authenticateJWT,logoutCustomer)


//service's endpoint
router.post('/service/create', authenticateJWT, requireSuperuser,createServices) // 
router.get('/service/view', viewServices)

// stylist endpoint 
router.post('/stylist/register', validateStylist,registerStylist)
router.post('/stylist/login',loginStylist)
router.get('/stylist/logout', authenticateJWT,logoutStylist)

//appointment endpoint

router.post('/appointment/create', validateAppointment,authenticateJWT, createAppointment)

module.exports = router