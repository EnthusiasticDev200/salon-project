import React, { useContext, useEffect } from 'react'
import { StylistAuthContext } from '../../components/Context/StylistAuthContext'
import DashboardLayout from '../../components/Layout/DashboardLayout'

const SDashboard = () => {
  const { setStylist, stylist } = useContext(StylistAuthContext)
  
  return (
    <DashboardLayout>
      {stylist}
    </DashboardLayout>
  )
}

export default SDashboard