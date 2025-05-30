import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { StylistAuthContext } from './StylistAuthContext';
import Loader from '../Loader';

const StylistProtected = ({ children }) => {
  const { stylist, setStylist } = useContext(StylistAuthContext);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedStylist = sessionStorage.getItem('stylistInfo');

    if (stylist) {
      setIsAuthenticated(true);
    } else if (storedStylist) {
      try {
        const parsedStylist = JSON.parse(storedStylist);
        setStylist(parsedStylist);
        setIsAuthenticated(true);
      } catch (e) {
        console.error('Failed to parse stored stylist:', e);
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }

    setLoading(false);
  }, [stylist, setStylist]);

  if (loading) return <Loader />;

  return isAuthenticated ? children : <Navigate to="/stylist/login" />;
};

export default StylistProtected;