import React, { useContext } from 'react'
import DashboardLayout from '../../components/Layout/DashboardLayout'
import { AdminAuthContext } from '../../components/Context/AdminAuthContext'

const ADashboard = () => {
  const { admin, setAdmin } = useContext(AdminAuthContext)

  return (
    <DashboardLayout>
      {admin}
    </DashboardLayout>
  )
}

export default ADashboard