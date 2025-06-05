import React from 'react'
import DashboardLayout from '../../components/Layout/DashboardLayout'
import { useState } from 'react'
import { useRef } from 'react'
import Alert from '../../components/ui/Alert'
import { useEffect } from 'react'
import { useContext } from 'react'
import { AdminAuthContext } from '../../components/Context/AdminAuthContext'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { UserAuthContext } from '../../components/Context/UserAuthContext'

const AddReview = () => {
  const { getServices } = useContext(AdminAuthContext)
  const { reviewAdd } = useContext(UserAuthContext)

  const [formValues, setFormValues] = useState({
    hairStyle: '',
    rating: 1,
    feedback: ''
  })
  const [alert, setAlert] = useState({
    type: 'error',
    message: ''
  });
  const [services, setServices] = useState([])

  useEffect(() => {
    const loadServices = async () => {
      try {
        const response = await getServices()
        console.log(response.data);
        setServices(response.data)
      } catch (error) {
        console.log(error);
      }
    }

    loadServices()
  }, [])

  useEffect(() => {
    if (alert.message) {
      const timeout = setTimeout(() => {
        setAlert(prev => ({ ...prev, message: '' })); // Clear the message
      }, 5000);
  
      return () => clearTimeout(timeout); // Clean up
    }
  }, [alert.message]);
  

  const alertRef = useRef(null)

  const handleChange = input => e => {
    setFormValues({ ...formValues, [input]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await reviewAdd(formValues)
      console.log(response.data);  

      if(response.success) {
        setFormValues({ hairStyle: '', rating: 1, feedback: '' });
        setAlert({type: 'success', message: response.message})
      } else {
        setAlert({type: 'error', message: response.message})
      }
    } catch (error) {
      console.error('Error adding review:', error.response?.data || error.message);
       setAlert({type: 'error', message: error.message})
    }
    
  }

  const filterService = services.map(service => service.hair_style)
  const ratingArray = [1, 2, 3, 4, 5]

  return (
    <DashboardLayout>
      <form className="p-8 rounded-lg bg-[#333]" onSubmit={handleSubmit}>
        <div className="mb-6">
          <h1 className="text-3xl font-semibold capitalize">Add a Review</h1>
          <p className="text-xl font-light">Add a review for a service rendered to you</p>
        </div>
        { 
          alert.message && 
          <Alert type={alert.type} ref={alertRef}>
            { alert.message }
          </Alert> 
        }
        <Input 
          element='select'
          id="hairStyle"
          label="Hairstyle"
          value={formValues.hairStyle}
          onChange={handleChange('hairStyle')}
          placeholder='Hairstyle'
          options={filterService}
          required
        />
        <Input 
          element='select'
          id="rating"
          label="Rating"
          value={formValues.rating}
          onChange={handleChange('rating')}
          placeholder='Service Rating'
          options={ratingArray}
          required
        />
        <Input 
          element='textarea'
          id="feedback"
          label="Feedback"
          value={formValues.feedback}
          onChange={handleChange('feedback')}
          placeholder='Feedback'
          required
        />
        <Button>Submit</Button>
      </form>
    </DashboardLayout>
  )
}

export default AddReview