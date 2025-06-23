import React, { useContext, useEffect, useState } from 'react'
import DashboardLayout from '../../components/Layout/DashboardLayout'
import { AdminAuthContext } from '../../components/Context/AdminAuthContext'
import Table from '../../components/ui/Table'

const Stylists = () => {
  const { getAllStylists } = useContext(AdminAuthContext)
  const [stylists, setStylists] = useState([])

  useEffect(() => {
    document.title = "View All Stylists | KhleanCutz"

    const loadStylists = async () => {
      try {
        const response = await getAllStylists()
        console.log(response.data);
        setStylists(response.data)
      } catch (error) {
        console.log(error)
      }
    }

    loadStylists()
  }, [])
  

  return (
    <DashboardLayout>
      <div>
        <h2 className="text-3xl font-bold">Stylists</h2>
        <p className="text-xl font-light">All the registered stylists</p>
      </div>
      <Table data={stylists} />
    </DashboardLayout>
  )
}

export default Stylists