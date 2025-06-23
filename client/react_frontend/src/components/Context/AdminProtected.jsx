import React, { useContext, useState,  useEffect } from 'react'
import { AdminAuthContext } from './AdminAuthContext'
import { Navigate } from 'react-router-dom'
import Loader from '../Loader';

const AdminProtected = ({ children }) => {
  const { admin, setAdmin } = useContext(AdminAuthContext);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedAdmin = sessionStorage.getItem('adminInfo');

    if (admin) {
      setIsAuthenticated(true);
    } else if (storedAdmin) {
      try {
        const parsedAdmin = JSON.parse(storedAdmin);
        setAdmin(parsedAdmin);
        setIsAuthenticated(true);
      } catch (e) {
        console.error('Failed to parse stored admin:', e);
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }

    setLoading(false);
  }, [admin, setAdmin]);

  if (loading) return <Loader />;

  return isAuthenticated ? children : <Navigate to="/admin/login" />;
}

export default AdminProtected