import React, { useContext, useState,  useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import Loader from '../Loader';
import { UserAuthContext } from './UserAuthContext';

const UserProtected = ({ children }) => {
  const { user, setUser } = useContext(UserAuthContext);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('userInfo');

    if (user) {
      setIsAuthenticated(true);
    } else if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (e) {
        console.error('Failed to parse stored user:', e);
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }

    setLoading(false);
  }, [user, setUser]);

  if (loading) return <Loader />;

  return isAuthenticated ? children : <Navigate to="/customer/login" />;
}

export default UserProtected