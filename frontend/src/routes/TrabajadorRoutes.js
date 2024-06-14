import React from 'react';
import { Route, Routes } from 'react-router-dom';
import IndexTrabComponent from '../components/Home/IndexTrabComponent';
import LogoutComponent from '../components/LogoutComponent';

const TrabajadorRoutes = () => {
  return (
    <Routes>
      <Route exact path='/home' element={<IndexTrabComponent />} />
      <Route exact path='/logout' element={<LogoutComponent />} />
    </Routes>
  );
};

export default TrabajadorRoutes;