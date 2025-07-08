import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ element, restricted = false }) => {
  const token = localStorage.getItem('token'); 
  return token && restricted ? <Navigate to="/home" /> : element;
};

export default PublicRoute;
