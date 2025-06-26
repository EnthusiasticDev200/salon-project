import React, { useContext } from 'react'
import DashboardLayout from '../../components/Layout/DashboardLayout'
import { UserAuthContext } from '../../components/Context/UserAuthContext'
import { useEffect } from 'react'

const CDashboard = () => {
  const { user } = useContext(UserAuthContext)
  useEffect(() => {
    document.title = "Customer Dashboard | KhleanCutz"
  }, [])
  

  return (
    <DashboardLayout>
      <div>
        <h2 className="text-3xl font-bold">{ user }</h2>
      </div>
    </DashboardLayout>
  )
}

export default CDashboard