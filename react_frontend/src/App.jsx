import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Home } from "./pages";
import ReactModal from "react-modal";
import { CDashboard, CLogin, CRegister } from './pages/Customers';
import { ADashboard, AddService, AddStylist, ALogin, ARegister, Services } from './pages/Admin';
import { AdminAuthContextProvider } from './components/Context/AdminAuthContext';
import AdminProtected from './components/Context/AdminProtected';
import { StylistAuthContextProvider } from './components/Context/StylistAuthContext';
import StylistProtected from './components/Context/StylistProtected';
import { SDashboard, SLogin, SRegister } from './pages/Stylist';

ReactModal.setAppElement("#root");

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <AdminAuthContextProvider>
        <StylistAuthContextProvider>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='customer/login' element={<CLogin />} />
            <Route path='customer/register' element={<CRegister />} />
            <Route path='customer/dashboard' element={<CDashboard />} />
            <Route path='admin/login' element={<ALogin />} />
            <Route path='admin/register' element={<ARegister />} />
            <Route path='admin/dashboard' element={<AdminProtected><ADashboard /></AdminProtected>} />
            <Route path='admin/add-service' element={<AdminProtected><AddService /></AdminProtected>} />
            <Route path='admin/services' element={<AdminProtected><Services /></AdminProtected>} />
            <Route path='stylist/login' element={<SLogin />} />
            <Route path='stylist/register' element={<SRegister />} />
            <Route path='stylist/dashboard' element={<StylistProtected><SDashboard /></StylistProtected>} />
          </Routes>
        </StylistAuthContextProvider>
      </AdminAuthContextProvider>
    </>
  )
}

export default App
