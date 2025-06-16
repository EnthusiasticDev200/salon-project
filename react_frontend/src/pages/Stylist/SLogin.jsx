import React, { useContext, useEffect, useState } from 'react'
import CustomerFormLayout from '../../components/Layout/CustomerFormLayout'
import BG from "./../../assets/bg2.jpg";
import { StylistAuthContext } from '../../components/Context/StylistAuthContext';
import Input from '../../components/ui/Input';
import { Navigate, useNavigate } from 'react-router-dom';
import Alert from '../../components/ui/Alert';

const SLogin = () => {
  const { loginStylist, stylist } = useContext(StylistAuthContext)
  const [formValues, setFormValues] = useState({
    email: '',
    password: '',
  })
  const [alert, setAlert] = useState({
    type: 'error',
    message: ''
  })
  useEffect(() => {
    document.title = "Customer Login | KhleanCutz"

    if (alert.message) {
      const timeout = setTimeout(() => {
        setAlert(prev => ({ ...prev, message: '' }));
      }, 5000);
    
      return () => clearTimeout(timeout);
    }
  }, [alert.message]);
  const navigate = useNavigate()

  useEffect(() => {
    document.title = "Stylist Login | KhleanCutz"
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
      } else {
        setAlert({ type: 'error', message: response.message })
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
        {
          alert.message &&
          <Alert type={alert.type}>
            { alert.message }
          </Alert>
        }
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