import React, { useState } from 'react'
import DashboardLayout from '../../components/Layout/DashboardLayout'
import Table from '../../components/ui/Table'
import { UserAuthContext } from '../../components/Context/UserAuthContext'
import { useContext } from 'react'
import { useEffect } from 'react'

const CAppointments = () => {
  const [appointments, setAppointments] = useState([])
  const { userProfile } = useContext(UserAuthContext)
  
    useEffect(() => {
      document.title = "Appointments | KhleanCutz"

      const loadProfile = async () => {
        try {
          const response = await userProfile()
          setAppointments(response.data[0])
        } catch (error) {
          console.log(error);
        }
      }
  
      loadProfile()
    }, [])

  return (
    <DashboardLayout>
      <div className='mb-6'>
        <h2 className="text-3xl font-bold">Appointments</h2>
        <p className="text-xl font-light">See the appointments you have made</p>
      </div>

      <Table data={appointments} />
    </DashboardLayout>
  )
}

export default CAppointments