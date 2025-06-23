import React, { useState } from 'react'
import ReactModal from 'react-modal'
import axios from "axios";
import Input from './ui/Input'

const AppointmentModal = ({ modalOpen, setModalOpen }) => {
  const [formValues, setFormValues] = useState({
    hairStyle: '',
    stylistUsername: '',
    appDate: '',
    appTime: ''
  })
  const [errors, setErrors] = useState({})

  const handleChange = input => e => {
    setFormValues({...formValues, [input]: e.target.value})
  }

  const formValidation = () => {
    const errors = {}
    let isValid = true

  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post('http://localhost:3100/auth/appointment/create', formValues, {
        headers: {
          'Content-Type': 'application/json',
          withCredentials: true
        },
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error creating appointment:', error.response?.data || error.message);
    }
  }

  return (
    <ReactModal 
      isOpen={modalOpen}
      onRequestClose={() => setModalOpen(false)}
      contentLabel="Example Modal"
      style={{
        overlay: {
          zIndex: 9999,
          backgroundColor: "rgba(0, 0, 0, 0.9)"
        },
        content: {
          width: window.innerWidth > 768 ? '70%' : '90%',
          left: window.innerWidth > 768 ? '15%' : '5%',
          height: window.innerWidth > 768 ? 'auto' : '80%',
          overflow: 'auto',
          backgroundColor: '#222',
          borderRadius: '20px',
          border: 'none',
          padding: 30,
          zIndex: 10000
        }
      }}
    >
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl text-center font-semibold capitalize">Book an appointment</h1>
          <i onClick={() => setModalOpen(false)} className='ri-close-line text-xl cursor-pointer text-red-400'></i>
        </div>
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
          type="text"
          id="stylist"
          label="Stylist Username"
          value={formValues.stylistUsername}
          onChange={handleChange('stylistUsername')}
          placeholder='Enter stylist username'
          required
        />
        <Input 
          type="date"
          id="appDate"
          label="Appointment Date"
          value={formValues.appDate}
          onChange={handleChange('appDate')}
          required
        />
        <Input 
          type="time"
          id="appTime"
          label="Appointment Time"
          value={formValues.appTime}
          onChange={handleChange('appTime')}
          required
        />
        <button className='py-4 px-12 bg-accent hover:bg-accentDark transition-all text-black rounded'>Make Appointment</button>
      </form>
    </ReactModal>
  )
}

export default AppointmentModal