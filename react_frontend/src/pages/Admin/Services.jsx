import React, { useContext, useEffect } from 'react'
import DashboardLayout from '../../components/Layout/DashboardLayout'
import { AdminAuthContext } from '../../components/Context/AdminAuthContext'

const Services = () => {
  const { getServices } = useContext(AdminAuthContext)
  useEffect(() => {
    const loadServices = async () => {
      try {
        const response = await getServices()
        console.log(response.data);
        
      } catch (error) {
        
      }
    }

    loadServices()
  }, [])
  

  return (
    <DashboardLayout>

    </DashboardLayout>
  )
}

export default Services