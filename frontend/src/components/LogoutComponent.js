import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutComponent = () => {
    const navigate = useNavigate();
  useEffect(() => {
    console.log('LOGOUT');
    window.localStorage.removeItem('appJornalesToken');

    setTimeout(() => {
        navigate('/');
    }, 1000);
    

  }, []);

  return <div>Logging out...</div>;
};

export default LogoutComponent;