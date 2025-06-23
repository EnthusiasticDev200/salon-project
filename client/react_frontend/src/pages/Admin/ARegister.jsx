import { useContext, useEffect, useState } from 'react'
import CustomerFormLayout from '../../components/Layout/CustomerFormLayout'
import Input from '../../components/ui/Input'
import axios from 'axios'
import BG from "./../../assets/bg3.jpg";
import { AdminAuthContext } from '../../components/Context/AdminAuthContext';
import Alert from '../../components/ui/Alert';

const ARegister = () => {
  const { registerAdmin } = useContext(AdminAuthContext)
  const [formValues, setFormValues] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    role: '',
    password: '',
  })
  const [alert, setAlert] = useState({
    type: 'error',
    message: ''
  })
  useEffect(() => {
    document.title = "Admin Register | KhleanCutz"
  
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
      const response = await registerAdmin(formValues)
      console.log(response);  
      
      if(response.success) {
        setFormValues({ username: '', email: '', phoneNumber: '', role: '', password: '' })
      }
    } catch (error) {
      console.error('Error registering admin:', error.response?.data || error.message);
    }
  }

  return (
    <CustomerFormLayout bg_image={BG}>
      <form onSubmit={handleSubmit}>
        <div className="my-4">
          <h1 className="text-3xl font-bold">Register</h1>
          <p className="text-xl font-light">Fill in your information</p>
        </div>

        {
          alert.message &&
          <Alert type={ alert.type }>
            { alert.message }
          </Alert>
        }

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
          type="text"
          id="role"
          label="Role"
          value={formValues.role}
          onChange={handleChange('role')}
          placeholder='Enter role'
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
        <button className='py-2 px-4 bg-accent hover:bg-accentDark transition-all text-black rounded'>Submit</button>
      </form>
    </CustomerFormLayout>
  )
}

export default ARegister