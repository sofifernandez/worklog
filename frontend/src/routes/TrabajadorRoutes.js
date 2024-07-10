import React from 'react';
import { Route, Routes } from 'react-router-dom';
import IndexTrabComponent from '../components/Home/IndexTrabComponent';
import LogoutComponent from '../components/LogoutComponent';
import ContainerBuscadorJornalComponent from '../components/functionalComponents/ContainerBuscadorJornalComponent';
import QrJornalComponent from '../components/QrJornalComponent';

const TrabajadorRoutes = () => {
  return (
    <Routes>
      <Route exact path='/' element={<IndexTrabComponent />} />
      <Route exact path='/buscar-jornal' element={<ContainerBuscadorJornalComponent/>}/>
      <Route exact path='/jornalQr/:id' element={<QrJornalComponent/>}/>
      <Route exact path='/logout' element={<LogoutComponent />} />
    </Routes>
  );
};

export default TrabajadorRoutes;