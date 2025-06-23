import React, { useState, useEffect, useContext } from 'react'
import DashboardLayout from '../../components/Layout/DashboardLayout'
import Table from '../../components/ui/Table'
import { StylistAuthContext } from '../../components/Context/StylistAuthContext'
import io from 'socket.io-client'

const SAppointments = () => {
  const [appointments, setAppointments] = useState([])
  const { getStylistProfile } = useContext(StylistAuthContext)
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    document.title = "Stylist Appointment | KhleanCutz"

    const loadProfile = async () => {
      try {
        const response = await getStylistProfile()
        setAppointments(response.data)
        
        const stylistUsername = response.data[1]?.username || 'stylist' // fallback
        const newSocket = io("http://localhost:3100", {
          reconnection: false,
          withCredentials: true,
        })

        newSocket.on("connect", () => {
          console.log("Socket connected:", newSocket.id)
          newSocket.emit("joinRoom", stylistUsername)
        })

        newSocket.on("appointmentNotification", (appointment) => {
          console.log("New appointment:", appointment)
          setAppointments(prev => [...prev, appointment])
        })

        setSocket(newSocket)

        return () => {
          newSocket.disconnect()
        }

      } catch (error) {
        console.error("Error loading profile:", error)
      }
    }

    loadProfile()
  }, [])

  const handleResponse = (appointmentId, status, customerUsername) => {
    if (!socket) {
      console.error("Socket not connected")
      return
    }

    socket.emit("stylistResponse", {
      appointmentId: Number(appointmentId),
      status,
      customerUsername
    })

    setAppointments(prev =>
      prev.map(appt =>
        appt.appointmentId === appointmentId ? { ...appt, status } : appt
      )
    )
  }

  return (
    <DashboardLayout>
      <div className='mb-6'>
        <h2 className="text-3xl font-bold">Appointments</h2>
        <p className="text-xl font-light">All the appointments booked for you</p>
      </div>

      <Table data={appointments} button={true} onRespond={handleResponse} />
    </DashboardLayout>
  )
}

export default SAppointments
