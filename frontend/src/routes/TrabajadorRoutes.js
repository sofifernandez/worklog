import React from 'react';
import { Route, Routes } from 'react-router-dom';
import IndexTrabComponent from '../components/Home/IndexTrabComponent';
import LogoutComponent from '../components/LogoutComponent';
import BuscadorJornalComponent from '../components/functionalComponents/BuscadorJornalComponent';
import ContainerBuscadorJornalComponent from '../components/functionalComponents/ContainerBuscadorJornalComponent';

const TrabajadorRoutes = () => {
  return (
    <Routes>
      <Route exact path='/home' element={<IndexTrabComponent />} />
      <Route exact path='/buscar-jornal' element={<ContainerBuscadorJornalComponent/>}/>
      <Route exact path='/logout' element={<LogoutComponent />} />
    </Routes>
  );
};

export default TrabajadorRoutes;