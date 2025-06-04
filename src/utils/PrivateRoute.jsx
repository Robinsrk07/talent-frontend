import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const PrivateRoute = () => {
  const [isAuth, setIsAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await axios.get(
          `${VITE_API_BASE_URL}/verify`,{withCredentials:true}
        
        );
        if (res.data.success) {
          setIsAuth(true);
        } else {
          setIsAuth(false);
        }
      } catch (err) {
        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  if (loading) return <div>Loading...</div>;
  return isAuth ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default PrivateRoute;