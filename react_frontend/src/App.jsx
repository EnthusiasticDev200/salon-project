import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Home } from "./pages";
import ReactModal from "react-modal";
import { AddAppointment, CAppointments, CDashboard, CLogin, CRegister } from './pages/Customers';
import { ADashboard, AddService, AddStylist, ALogin, Appointments, ARegister, Customers, Services, Stylists } from './pages/Admin';
import { AdminAuthContextProvider } from './components/Context/AdminAuthContext';
import AdminProtected from './components/Context/AdminProtected';
import { StylistAuthContextProvider } from './components/Context/StylistAuthContext';
import StylistProtected from './components/Context/StylistProtected';
import { SAppointments, SDashboard, SLogin, SRegister } from './pages/Stylist';
import UserProtected from './components/Context/UserProtected';
import { UserAuthContextProvider } from './components/Context/UserAuthContext';

ReactModal.setAppElement("#root");

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <AdminAuthContextProvider>
        <StylistAuthContextProvider>
          <UserAuthContextProvider>
            <Routes>
              <Route path='/' element={<Home />} />

              {/* Customer Routes */}
              <Route path='customer/login' element={<CLogin />} />
              <Route path='customer/register' element={<CRegister />} />
              <Route path='customer/dashboard' element={<UserProtected><CDashboard /></UserProtected>} />
              <Route path='customer/add-appointment' element={<UserProtected><AddAppointment /></UserProtected>} />
              <Route path='customer/appointments' element={<UserProtected><CAppointments /></UserProtected>} />

              {/* Admin Routes */}
              <Route path='admin/login' element={<ALogin />} />
              <Route path='admin/register' element={<ARegister />} />
              <Route path='admin/dashboard' element={<AdminProtected><ADashboard /></AdminProtected>} />
              <Route path='admin/add-service' element={<AdminProtected><AddService /></AdminProtected>} />
              <Route path='admin/services' element={<AdminProtected><Services /></AdminProtected>} />
              <Route path='admin/all-appointments' element={<AdminProtected><Appointments /></AdminProtected>} />
              <Route path='admin/all-stylists' element={<AdminProtected><Stylists /></AdminProtected>} />
              <Route path='admin/all-customers' element={<AdminProtected><Customers /></AdminProtected>} />

              {/* Stylist Routes */}
              <Route path='stylist/login' element={<SLogin />} />
              <Route path='stylist/register' element={<SRegister />} />
              <Route path='stylist/dashboard' element={<StylistProtected><SDashboard /></StylistProtected>} />
              <Route path='stylist/appointments' element={<StylistProtected><SAppointments /></StylistProtected>} />
            </Routes>
          </UserAuthContextProvider>
        </StylistAuthContextProvider>
      </AdminAuthContextProvider>
    </>
  )
}

export default App
