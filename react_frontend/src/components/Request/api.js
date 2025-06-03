import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_ADDRESS}`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Admin
export const adminLogin = data => API.post('/auth/admin/login', data)
export const adminRegister = data => API.post('/auth/admin/register', data)
export const adminUpdatePassword = data => API.put('/auth/admin/logout', data)
export const adminLogout = () => API.get('/auth/admin/logout')

// Stylist
export const stylistRegister = data => API.post('/auth/stylist/register', data)
export const stylistLogin = data => API.post('/auth/stylist/login', data)
export const stylistLogout = () => API.get('/auth/stylist/logout')
export const allStylists = () => API.get('/auth/stylist/view')

// Customer
export const customerRegister = data => API.post('/auth/customer/register', data)
export const customerLogin = data => API.post('/auth/customer/login', data)
export const customerLogout = () => API.get('/auth/customer/profile/logout')
export const customerProfile = () => API.get('/auth/customer/login/profile')
export const viewCustomers = () => API.get('/auth/customer/view')

// Appointment
export const addAppointment = data => API.post('/auth/appointment/create', data)
export const allAppointments = () => API.get('/auth/appointment/view')

// Services
export const addServices = data => API.post('/auth/service/create', data)
export const viewServices = () => API.get('/auth/service/view')