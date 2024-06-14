import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LogoutComponent = () => {
  const {setPersonaRolLoggeado} = useAuth();
  const navigate = useNavigate();
  window.localStorage.removeItem('appJornalesToken');
  localStorage.removeItem('personaRolLoggeado');


  useEffect(() => {
    window.localStorage.removeItem('appJornalesToken');
    setPersonaRolLoggeado([]);

    setTimeout(() => {
        navigate('/');
    }, 1000); 
  });

  return <div>Logging out...</div>;
};

export default LogoutComponent;