import React from 'react';
import { Route, Routes } from 'react-router-dom';
import IndexJefeComponent from '../components/Home/IndexJefeComponent';
import LogoutComponent from '../components/LogoutComponent';
import ContainerBuscadorJornalComponent from '../components/functionalComponents/ContainerBuscadorJornalComponent';

const JefeObraRoutes = () => {
  return (
    <Routes>
      <Route exact path='/home' element={<IndexJefeComponent />} />
      <Route exact path='/logout' element={<LogoutComponent />} />
      <Route exact path='/buscar-jornal' element={<ContainerBuscadorJornalComponent adminView={true}/>}/>
    </Routes>
  );
};

export default JefeObraRoutes;