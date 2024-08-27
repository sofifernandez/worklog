import React from 'react';
import { Route, Routes } from 'react-router-dom';
import IndexTrabComponent from '../components/Home/IndexTrabComponent';
import LogoutComponent from '../components/LogoutComponent';
import ChangePassword from '../components/functionalComponents/ChangePassword';
import QrJornalComponent from '../components/QrJornalComponent';
import BuscarJornalComponent from '../components/BuscarJornalComponent';

const TrabajadorRoutes = () => {
  return (
    <Routes>
      <Route exact path='/' element={<IndexTrabComponent />} />
      <Route exact path='/home' element={<IndexTrabComponent />} />
      <Route exact path='/buscar-jornal' element={<BuscarJornalComponent workerView={true}/>}/>
      <Route exact path='/jornalQr/:id' element={<QrJornalComponent/>}/>
      <Route exact path='/logout' element={<LogoutComponent />} />
      <Route exact path='/resetpassword/:id' element={<ChangePassword />} />
    </Routes>
  );
};

export default TrabajadorRoutes;