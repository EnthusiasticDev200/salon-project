import React, { useState, useContext, useEffect } from 'react'
import { StylistAuthContext } from '../../components/Context/StylistAuthContext'
import DashboardLayout from '../../components/Layout/DashboardLayout'

const SDashboard = () => {
  const { stylist, getStylistInfo } = useContext(StylistAuthContext)
  const [username, setUsername] = useState('')

  useEffect(() => {
    document.title = "Stylist Dashboard | KhleanCutz"

    const getInfo = async () => {
      try {
        const response = await getStylistInfo()
        setUsername(response.data.username)
        console.log(response.data)
      } catch (error) {
        console.log(error)
      }
    }

    getInfo()
  }, [])
  
  
  return (
    <DashboardLayout>
      <h1 className='font-bold text-2xl md:text-3xl'>Welcome {username}</h1>
    </DashboardLayout>
  )
}

export default SDashboard