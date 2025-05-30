import { useState } from 'react'
import CustomerFormLayout from '../../components/Layout/CustomerFormLayout'
import Input from '../../components/ui/Input'
import axios from 'axios'
import BG from "./../../assets/bg1.jpg";

const CLogin = () => {
  const [formValues, setFormValues] = useState({
    email: '',
    password: '',
  })

  const handleChange = input => e => {
    setFormValues({ ...formValues, [input]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_ADDRESS}/auth/customer/login`, formValues, {
        headers: {
          'Content-Type': 'application/json'
        },
      })
      console.log(response.data);  
    } catch (error) {
      console.error('Error registering customer:', error.response?.data || error.message);
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

export default CLogin