import React, { useContext } from 'react'
import Logo from "./../../assets/logo.png";
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { StylistAuthContext } from '../Context/StylistAuthContext';
import { AdminAuthContext } from '../Context/AdminAuthContext';
import { UserAuthContext } from '../Context/UserAuthContext';

const Sidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation()
  const navigate = useNavigate()

  const { setStylist, logoutStylist } = useContext(StylistAuthContext)
  const { setAdmin, logoutAdmin } = useContext(AdminAuthContext)
  const { setUser, logoutUser } = useContext(UserAuthContext)

  let navItems = []

  if(location.pathname.includes('/stylist/')) {
    navItems = [
      {icon: <i className='ri-home-3-line'></i>, title: 'Home', to: '/stylist/dashboard'},
      {icon: <i className='ri-table-view'></i>, title: 'Appointments', to: '/stylist/appointments'},
    ]
  } else if(location.pathname.includes('/admin/')) {
    navItems = [
      {icon: <i className='ri-home-3-line'></i>, title: 'Home', to: '/admin/dashboard'},
      {icon: <i className='ri-group-line'></i>, title: 'Stylists', to: '/admin/all-stylists'},
      {icon: <i className='ri-user-community-line'></i>, title: 'Customers', to: '/admin/all-customers'},
      {icon: <i className='ri-scissors-2-line'></i>, title: 'Services', to: '/admin/services'},
      {icon: <i className='ri-table-view'></i>, title: 'Appointments', to: '/admin/all-appointments'},
      {icon: <i className='ri-add-circle-line'></i>, title: 'Add Services', to: '/admin/add-service'},
    ]
  } else {
    navItems = [
      {icon: <i className='ri-home-3-line'></i>, title: 'Home', to: '/customer/dashboard'},
      {icon: <i className='ri-table-view'></i>, title: 'Appointments', to: '/customer/appointments'},
      {icon: <i className='ri-add-circle-line'></i>, title: 'Add Appointment', to: '/customer/add-appointment'},
    ]
  }

  const logout = async () => {
    if(location.pathname.includes('/stylist/')) {
      try {
        const response = await logoutStylist()
        if(response.success) {
          navigate('/stylist/login')
        }
      } catch (error) {
        console.log(error);
      }
    } else if(location.pathname.includes('/admin/')) {
      try {
        const response = await logoutAdmin()
        if(response.success) {
          navigate('/admin/login')
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const response = await logoutUser()
        if(response.success) {
          navigate('/customer/login')
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <div className={`border-r-2 border-r-[#333] transition-all duration-300 ${collapsed ? "w-0 md:w-16 md:px-2" : "w-64 px-4"} py-8 flex flex-col justify-between h-full fixed z-50 md:static bg-[#333]`}>
      <div className="flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src={Logo} alt="" className='w-[50px]' />
            { !collapsed && <h3 className="text-xl font-semibold">KC</h3> }
          </div>
          <i className={`ri-sidebar-fold-line ${collapsed ? 'hidden' : 'block'} md:hidden`}  onClick={() => setCollapsed(!collapsed)}></i>
        </div>
        
        <nav className="flex flex-col gap-4">
          {navItems.map((item, index) => (
            <NavLink
              key={index}
              className={`flex items-center gap-3 ${collapsed ? 'md:p-3' : 'p-4'} rounded-lg cursor-pointer hover:bg-accent hover:text-black transition-all`}
              to={item.to}
            >
              <span className={`${ collapsed ? 'hidden md:inline-block pl-[0.2rem]' : 'inline-block' }`}>{item.icon}</span>
              {!collapsed && <span>{item.title}</span>}
            </NavLink>
          ))} 
          
        </nav>
      </div>
      <button className={`flex items-center gap-4 ${collapsed ? 'md:p-3' : 'p-4'} rounded-lg cursor-pointer bg-red-500 text-white transition-all`} onClick={logout}>
        <i  className={`${ collapsed ? 'hidden md:inline-block' : 'inline-block' } ri-logout-circle-line`}></i>
        {!collapsed && <span>Logout</span>}
      </button>
    </div>
  )
}

export default Sidebar