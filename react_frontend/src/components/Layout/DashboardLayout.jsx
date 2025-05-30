import React, { useState } from 'react'
import Sidebar from '../ui/Sidebar'

const DashboardLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <div className='h-[100vh] flex'>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex-1 bg-[#222] h-full overflow-auto">
        <div className="p-4 bg-[#333] text-white">
          <i className={`${collapsed ? 'ri-sidebar-unfold-line' : 'ri-sidebar-fold-line'}`}  onClick={() => setCollapsed(!collapsed)}></i>
        </div>
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout