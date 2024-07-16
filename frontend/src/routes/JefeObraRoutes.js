import React from 'react';
import { Route, Routes } from 'react-router-dom';
import IndexJefeComponent from '../components/Home/IndexJefeComponent';
import LogoutComponent from '../components/LogoutComponent';
import ContainerBuscadorJornalComponent from '../components/functionalComponents/ContainerBuscadorJornalComponent';
import QrJornalComponent from '../components/QrJornalComponent';
import AddRainToObra from '../components/AddRainToObra'

const JefeObraRoutes = () => {
  return (
    <Routes>
      <Route exact path='/' element={<IndexJefeComponent />} />
      <Route exact path='/logout' element={<LogoutComponent />} />
      <Route exact path='/jornalQr/:id' element={<QrJornalComponent/>}/>
      <Route exact path='/buscar-jornal' element={<ContainerBuscadorJornalComponent adminView={true}/>}/>
      <Route exact path='/add-rain' element={<AddRainToObra/>}/>
    </Routes>
  );
};

export default JefeObraRoutes;