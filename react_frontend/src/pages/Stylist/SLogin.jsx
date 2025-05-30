import React, { useContext, useEffect, useState } from 'react'
import CustomerFormLayout from '../../components/Layout/CustomerFormLayout'
import BG from "./../../assets/bg2.jpg";
import { StylistAuthContext } from '../../components/Context/StylistAuthContext';
import Input from '../../components/ui/Input';
import { Navigate, useNavigate } from 'react-router-dom';

const SLogin = () => {
  const { loginStylist, stylist } = useContext(StylistAuthContext)
  const [formValues, setFormValues] = useState({
    email: '',
    password: '',
  })
  const navigate = useNavigate()

  useEffect(() => {
    console.log(sessionStorage.getItem('stylistInfo'), stylist);
  }, [])
  
  
  const handleChange = input => e => {
    setFormValues({ ...formValues, [input]: e.target.value })
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
  
    try {
      const response = await loginStylist(formValues)
      console.log(response.data);  

      if(response.success) {
        setFormValues({ email: '', password: '' });
        navigate('/stylist/dashboard')
      }
    } catch (error) {
      console.error('Error logging in stylist:', error.response?.data || error.message);
    }
  }

  return (
    <CustomerFormLayout bg_image={BG}>
      <form onSubmit={handleSubmit}>
        <div className="my-4">
          <h1 className="text-3xl font-bold">Login</h1>
          <p className="text-xl font-light">Enter your details to login</p>
        </div>
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
          type="password"
          id="password"
          label="Password"
          value={formValues.password}
          onChange={handleChange('password')}
          placeholder='Enter password'
          required
        />
        <button className='py-2 px-4 bg-accent hover:bg-accentDark transition-all text-black rounded'>Login</button>
      </form>
    </CustomerFormLayout>
  )
}

export default SLogin