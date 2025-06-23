import React, { useContext, useEffect, useState } from 'react'
import DashboardLayout from '../../components/Layout/DashboardLayout'
import { AdminAuthContext } from '../../components/Context/AdminAuthContext'
import Table from '../../components/ui/Table'

const Appointments = () => {
  const { getAppointments } = useContext(AdminAuthContext)
  const [appointments, setAppointments] = useState([])

  useEffect(() => {
    document.title = "View All Appointments | KhleanCutz"

    const loadServices = async () => {
      try {
        const response = await getAppointments()
        console.log(response.data);
        setAppointments(response.data)
      } catch (error) {
        console.log(error)
      }
    }

    loadServices()
  }, [])
  

  return (
    <DashboardLayout>
      <div>
        <h2 className="text-3xl font-bold">Appointments</h2>
        <p className="text-xl font-light">All the appointments that have been made</p>
      </div>
      <Table data={appointments} />
    </DashboardLayout>
  )
}

export default Appointments