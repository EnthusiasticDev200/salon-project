import React, { useContext, useEffect, useRef, useState } from 'react'
import DashboardLayout from '../../components/Layout/DashboardLayout'
import { UserAuthContext } from '../../components/Context/UserAuthContext'
import Input from '../../components/ui/Input'
import { AdminAuthContext } from '../../components/Context/AdminAuthContext'
import Alert from '../../components/ui/Alert'

const AddAppointment = () => {
  const { appointmentAdd } = useContext(UserAuthContext)
  const { getAllStylists } = useContext(AdminAuthContext)

  const [formValues, setFormValues] = useState({
    hairStyle: '',
    stylistUsername: '',
    appointmentDate: '',
    appointmentTime: ''
  })
  const [stylists, setStylists] = useState([])
  const [alert, setAlert] = useState({
    type: 'error',
    message: ''
  });
  const alertRef = useRef(null)

  useEffect(() => {
    document.title = "Add Appointment | KhleanCutz"

    const loadStylists = async () => {
      try {
        const response = await getAllStylists()
        console.log(response.data);
        setStylists(response.data)
      } catch (error) {
        console.log(error)
      }
    }
  
    loadStylists()
  }, [])

  useEffect(() => {
    if (alert.message) {
      const timeout = setTimeout(() => {
        setAlert(prev => ({ ...prev, message: '' }));
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [alert.message]);
  
  

  const handleChange = input => e => {
    setFormValues({ ...formValues, [input]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
  
    try {
      const response = await appointmentAdd(formValues)
      console.log(response.data);  

      if(response.success) {
        setFormValues({ hairStyle: '', price: '', appointmentDate: '', appointmentTime: '' });
        setAlert({type: 'success', message: response.message})
      } else {
        setAlert({type: 'error', message: response.message})
      }
    } catch (error) {
      console.error('Error adding service:', error.response?.data || error.message);
       setAlert({type: 'error', message: error.message})
    }
  }

  const styUser = stylists.map(stylist => stylist.username)

  return (
    <DashboardLayout>
      <form className="p-8 rounded-lg bg-[#333]" onSubmit={handleSubmit}>
        <div className="mb-6">
          <h1 className="text-3xl font-semibold capitalize">Book an appointment</h1>
          <p className="text-xl font-light">Fill in the form to book appointment</p>
        </div>
        { 
          alert.message && 
          <Alert type={alert.type} ref={alertRef}>
            { alert.message }
          </Alert> 
        }
        <Input 
          type="text"
          id="hairStyle"
          label="Hair Style"
          value={formValues.hairStyle}
          onChange={handleChange('hairStyle')}
          placeholder='Enter hairstyle'
          required
        />
        <Input 
          element='select'
          id="stylist"
          label="Stylist Username"
          value={formValues.stylistUsername}
          onChange={handleChange('stylistUsername')}
          placeholder='Enter stylist username'
          options={styUser}
          required
        />
        <Input 
          type="date"
          id="appDate"
          label="Appointment Date"
          value={formValues.appointmentDate}
          onChange={handleChange('appointmentDate')}
          required
        />
        <Input 
          type="time"
          id="appTime"
          label="Appointment Time"
          value={formValues.appointmentTime}
          onChange={handleChange('appointmentTime')}
          required
        />
        <button className='py-4 px-12 bg-accent hover:bg-accentDark transition-all text-black rounded'>Make Appointment</button>
      </form>
    </DashboardLayout>
  )
}

export default AddAppointment