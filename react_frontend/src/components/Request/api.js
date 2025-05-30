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

// Customer
export const customerRegister = data => API.post('/auth/customer/register', data)
export const customerLogin = data => API.post('/auth/customer/login', data)
export const customerLogout = () => API.get('/auth/customer/profile/logout', data)
export const customerProfile = () => API.get('/auth/customer/login/profile', data)

// Appointment
export const addAppointment = data => API.post('/auth/appointment/create', data)
export const appointments = () => API.get('/auth/appointments/table')

// Services
export const addServices = data => API.post('/auth/service/create', data)
export const services = () => API.get('/auth/services/table')