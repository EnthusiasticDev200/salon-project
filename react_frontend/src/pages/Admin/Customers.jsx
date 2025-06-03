import React, { useContext, useEffect, useState } from 'react'
import DashboardLayout from '../../components/Layout/DashboardLayout'
import { AdminAuthContext } from '../../components/Context/AdminAuthContext'
import Table from '../../components/ui/Table'

const Customers = () => {
  const [customers, setCustomers] = useState([])
  const { getAllCustomers } = useContext(AdminAuthContext)

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const response = await getAllCustomers()
        setCustomers(response.data)
      } catch (error) {
        console.log(error)
      }
    }

    loadCustomers()
  }, [])
  

  return (
    <DashboardLayout>
      <div>
        <h2 className="text-3xl font-bold">Customers</h2>
        <p className="text-xl font-light">All the registered customers</p>
      </div>

      <Table data={customers} />
    </DashboardLayout>
  )
}

export default Customers