import { useContext, useState, useEffect, useRef } from 'react'
import CustomerFormLayout from '../../components/Layout/CustomerFormLayout'
import Input from '../../components/ui/Input'
import Alert from '../../components/ui/Alert'
import BG from "./../../assets/bg1.jpg";
import { UserAuthContext } from '../../components/Context/UserAuthContext';
import { Link, useNavigate } from 'react-router-dom';

const CLogin = () => {
  const { loginUser } = useContext(UserAuthContext)
  const navigate = useNavigate()
  const alertRef = useRef(null)

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

  const handleChange = input => e => {
    setFormValues({ ...formValues, [input]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await loginUser(formValues)

      if(response.success) {
        navigate('/customer/dashboard')
      } else {
        setAlert({ type: 'error', message: response.message })
      }
      console.log(response.data);  
    } catch (error) {
      setAlert({ type: 'error', message: error.response?.data || error.message })
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
        {
          alert.message && 
          <Alert type={alert.type} ref={alertRef}>
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
        <p className="my-3">
          Don't have an account? Click <Link to={'/customer/register'} className='text-accent font-bold'>Here</Link> to register
        </p>
      </form>
    </CustomerFormLayout>
  )
}

export default CLogin