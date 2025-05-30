import React, { useContext, useState } from 'react'
import DashboardLayout from '../../components/Layout/DashboardLayout'
import { AdminAuthContext } from '../../components/Context/AdminAuthContext'
import Input from '../../components/ui/Input'

const AddService = () => {
  const { serviceAdd } = useContext(AdminAuthContext)

  const [formValues, setFormValues] = useState({
    hairStyle: '',
    price: ''
  })

  const handleChange = input => e => {
    setFormValues({ ...formValues, [input]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
  
    try {
      const response = await serviceAdd(formValues)
      console.log(response.data);  

      if(response.success) {
        setFormValues({ hairStyle: '', price: '' });
      }
    } catch (error) {
      console.error('Error adding service:', error.response?.data || error.message);
    }
  }


  return (
    <DashboardLayout>
      <form className="py-5 px-8 rounded-lg bg-[#333]" onSubmit={handleSubmit}>
        <div className="my-4">
          <h1 className="text-2xl font-bold">Add a Service</h1>
          <p className="font-light">Fill in the form to add a service</p>
        </div>
        <Input 
          type="text"
          id="hairStyle"
          label="Hair Style"
          value={formValues.hairStyle}
          onChange={handleChange('hairStyle')}
          placeholder='Enter hairStyle'
          required
        />
        <Input 
          type="number"
          id="price"
          label="Price"
          value={formValues.price}
          onChange={handleChange('price')}
          placeholder='Enter price'
          required
        />
        <button className='py-2 px-4 bg-accent hover:bg-accentDark transition-all text-black rounded'>Add Service</button>
      </form>
    </DashboardLayout>
  )
}

export default AddService