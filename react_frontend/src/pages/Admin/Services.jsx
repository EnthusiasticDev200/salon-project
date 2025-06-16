import React, { useContext, useEffect, useState } from 'react'
import DashboardLayout from '../../components/Layout/DashboardLayout'
import { AdminAuthContext } from '../../components/Context/AdminAuthContext'
import Table from '../../components/ui/Table'

const Services = () => {
  const { getServices } = useContext(AdminAuthContext)
  const [services, setServices] = useState([])

  useEffect(() => {
    document.title = "View All Services | KhleanCutz"

    const loadServices = async () => {
      try {
        const response = await getServices()
        console.log(response.data);
        setServices(response.data)
      } catch (error) {
        console.log(error)
      }
    }

    loadServices()
  }, [])
  

  return (
    <DashboardLayout>
      <div>
        <h2 className="text-3xl font-bold">Services</h2>
        <p className="text-xl font-light">All the services we render</p>
      </div>
      <Table data={services} />
    </DashboardLayout>
  )
}

export default Services