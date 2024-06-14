import React from 'react';
import { Route, Routes } from 'react-router-dom';
import IndexJefeComponent from '../components/Home/IndexJefeComponent';
import LogoutComponent from '../components/LogoutComponent';

const JefeObraRoutes = () => {
  return (
    <Routes>
      <Route exact path='/home' element={<IndexJefeComponent />} />
      <Route exact path='/logout' element={<LogoutComponent />} />
    </Routes>
  );
};

export default JefeObraRoutes;