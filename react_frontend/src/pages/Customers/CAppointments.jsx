import React, { useState } from 'react'
import DashboardLayout from '../../components/Layout/DashboardLayout'
import Table from '../../components/ui/Table'

const CAppointments = () => {
  const [appointments, setAppointments] = useState([])

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