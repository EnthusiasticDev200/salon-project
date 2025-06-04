import React, { useState } from 'react'
import DashboardLayout from '../../components/Layout/DashboardLayout'
import Table from '../../components/ui/Table'
import { useEffect } from 'react'
import { useContext } from 'react'
import { StylistAuthContext } from '../../components/Context/StylistAuthContext'

const SAppointments = () => {
  const [appointments, setAppointments] = useState([])
  const { getStylistProfile } = useContext(StylistAuthContext)

  useEffect(() => {
    const loadProfile = async () =>  {
      try {
        const response = await getStylistProfile()
        setAppointments(response.data[0])
      } catch (error) {
        console.log(error)
      }
    }

    loadProfile()
  }, [])
  

  return (
    <DashboardLayout>
      <div className='mb-6'>
        <h2 className="text-3xl font-bold">Appointments</h2>
        <p className="text-xl font-light">All the appointments booked for you</p>
      </div>

      <Table data={appointments} button={true} />
    </DashboardLayout>
  )
}

export default SAppointments