import React, { useContext } from 'react'
import DashboardLayout from '../../components/Layout/DashboardLayout'
import { UserAuthContext } from '../../components/Context/UserAuthContext'

const CDashboard = () => {
  const { user } = useContext(UserAuthContext)

  return (
    <DashboardLayout>
      <div>
        <h2 className="text-3xl font-bold">Welcome</h2>
      </div>
    </DashboardLayout>
  )
}

export default CDashboard