import React, { useContext, useState } from 'react'
import CustomerFormLayout from '../../components/Layout/CustomerFormLayout'
import BG from "./../../assets/bg3.jpg";
import { StylistAuthContext } from '../../components/Context/StylistAuthContext';
import Input from '../../components/ui/Input';

const SRegister = () => {
  const { registerStylist } = useContext(StylistAuthContext)
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
    specialization: ''
  })

  const handleChange = input => e => {
    setFormValues({ ...formValues, [input]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await registerStylist(formValues)
      console.log(response); 
      
      setFormValues({ firstName: '', lastName: '', username: '', email: '', phoneNumber: '', password: '', specialization: '' })
    } catch (error) {
      console.error('Error registering stylist:', error.response?.data || error.message);
    }
  }

  return (
    <CustomerFormLayout bg_image={BG}>
      <form onSubmit={handleSubmit}>
        <div className="my-4">
          <h1 className="text-3xl font-bold">Register</h1>
          <p className="text-xl font-light">Fill in your information</p>
        </div>
        <Input 
          type="text"
          id="firstName"
          label="Firstname"
          value={formValues.firstName}
          onChange={handleChange('firstName')}
          placeholder='Enter firstName'
          required
        />
        <Input 
          type="text"
          id="lastName"
          label="Lastname"
          value={formValues.lastName}
          onChange={handleChange('lastName')}
          placeholder='Enter lastname'
          required
        />
        <Input 
          type="text"
          id="username"
          label="Username"
          value={formValues.username}
          onChange={handleChange('username')}
          placeholder='Enter username'
          required
        />
        <Input 
          type="email"
          id="email"
          label="Email"
          value={formValues.email}
          onChange={handleChange('email')}
          placeholder='Enter email'
          required
        />
        <Input 
          type="tel"
          id="phoneNumber"
          label="Phone Number"
          value={formValues.phoneNumber}
          onChange={handleChange('phoneNumber')}
          placeholder='Enter phone number'
          required
        />
        <Input 
          type="password"
          id="password"
          label="Password"
          value={formValues.password}
          onChange={handleChange('password')}
          placeholder='Enter password'
          required
        />
        <Input 
          type="text"
          id="specialization"
          label="Specialization"
          value={formValues.specialization}
          onChange={handleChange('specialization')}
          placeholder='Enter specialization'
          required
        />
        <button className='py-2 px-4 bg-accent hover:bg-accentDark transition-all text-black rounded'>Submit</button>
      </form>
    </CustomerFormLayout>
  )
}

export default SRegister