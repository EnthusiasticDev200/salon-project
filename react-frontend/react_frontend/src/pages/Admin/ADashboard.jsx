import React, { useContext, useEffect, useState } from 'react'
import DashboardLayout from '../../components/Layout/DashboardLayout'
import { AdminAuthContext } from '../../components/Context/AdminAuthContext'
import Card from '../../components/ui/Card'
import axios from 'axios'

const ADashboard = () => {
  const { admin, getServices, getAppointments, getAllStylists } = useContext(AdminAuthContext)
  const [stylists, setStylists] = useState(0)
  const [appointments, setAppointments] = useState(0)
  const [services, setServices] = useState(0)
  const [clients, setClients] = useState(0)

  useEffect(() => {
    document.title = "Admin Dashboard | KhleanCutz"

    const fetchAnalytics = async () => {
      try {
        const [serviceRes, appointmentRes, stylistRes] = await Promise.all([
          getServices(), getAppointments(), getAllStylists()
        ])
        console.log(stylistRes.data.length, appointmentRes.data.length, serviceRes.data.length)
        setStylists(stylistRes.data.length)
        setAppointments(appointmentRes.data.length)
        setServices(serviceRes.data.length)
        
      } catch (error) {
        console.error("Error fetching data", error);
      }
    }

    fetchAnalytics()
  }, [])
  

  return (
    <DashboardLayout>
      <div className='my-4'>
        <h1 className="text-2xl md:text-3xl capitalize font-bold">{ admin }</h1>
        <p className='font-light text-xl'>Check out all the activities on KhleanCutz</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
        <Card className={'flex justify-center items-center gap-4 py-8'}>
          <i className="ri-group-2-line text-6xl"></i>
          <div className='text-center'>
            <h3 className="font-semibold text-6xl">{stylists}</h3>
            <p className="font-light text-xl">Stylists</p>
          </div>
        </Card>
        <Card className={'flex justify-center items-center gap-4 py-8'}>
          <i className="ri-group-2-line text-6xl"></i>
          <div className='text-center'>
            <h3 className="font-semibold text-6xl">{appointments}</h3>
            <p className="font-light text-xl">Appointments</p>
          </div>
        </Card>
        <Card className={'flex justify-center items-center gap-4 py-8'}>
          <i className="ri-group-2-line text-6xl"></i>
          <div className='text-center'>
            <h3 className="font-semibold text-6xl">{clients}</h3>
            <p className="font-light text-xl">Customers</p>
          </div>
        </Card>
        <Card className={'flex justify-center items-center gap-4 py-8'}>
          <i className="ri-group-2-line text-6xl"></i>
          <div className='text-center'>
            <h3 className="font-semibold text-6xl">{services}</h3>
            <p className="font-light text-xl">Services</p>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}

export default ADashboard