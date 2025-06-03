import React, { useContext, useEffect, useState } from 'react'
import DashboardLayout from '../../components/Layout/DashboardLayout'
import { UserAuthContext } from '../../components/Context/UserAuthContext'

const Profile = () => {
  const { userProfile } = useContext(UserAuthContext)
  const [profile, setProfile] = useState({})

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await userProfile()
        console.log(response.data);
        
      } catch (error) {
        console.log(error);
        
      }
    }

    loadProfile()
  }, [])
  

  return (
    <DashboardLayout>
      <div className='mb-6'>
        <h2 className="text-3xl font-bold">Profile</h2>
      </div>
    </DashboardLayout>
  )
}

export default Profile