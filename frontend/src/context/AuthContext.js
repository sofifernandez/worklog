import React, { createContext, useState, useContext,useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [personaRolLoggeado, setPersonaRolLoggeado] = useState(() => {
    // Try to get the initial state from local storage
    const savedRole = localStorage.getItem('personaRolLoggeado');
    return savedRole ? JSON.parse(savedRole) : { "rol": {"rol": "NONE"}, "persona": {"nombre": "NONE"} };
  });

  useEffect(() => {
    // Save the state to local storage whenever it changes
    localStorage.setItem('personaRolLoggeado', JSON.stringify(personaRolLoggeado));
  }, [personaRolLoggeado]);

  return (
    <AuthContext.Provider value={{ personaRolLoggeado, setPersonaRolLoggeado }}>
      {children}
    </AuthContext.Provider>
  );
};


export default AuthProvider;