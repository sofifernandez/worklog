import React from 'react';
import { Route, Routes } from 'react-router-dom';
import IndexTrabComponent from '../components/Home/IndexTrabComponent';
import LogoutComponent from '../components/LogoutComponent';
import ContainerBuscadorJornalComponent from '../components/functionalComponents/ContainerBuscadorJornalComponent';
import ChangePassword from '../components/functionalComponents/ChangePassword';

const TrabajadorRoutes = () => {
  return (
    <Routes>
      <Route exact path='/home' element={<IndexTrabComponent />} />
      <Route exact path='/buscar-jornal' element={<ContainerBuscadorJornalComponent />} />
      <Route exact path='/logout' element={<LogoutComponent />} />
      <Route exact path='/resetpassword/:id' element={<ChangePassword />} />
    </Routes>
  );
};

export default TrabajadorRoutes;