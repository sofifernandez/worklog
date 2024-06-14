import React from 'react';
import { Route, Routes } from 'react-router-dom';
import IndexAdminComponent from '../components/Home/IndexAdminComponent';
import ListPersonasComponent from '../components/ListPersonasComponent';
import AddPersonaComponent from '../components/AddPersonaComponent';
import ListObrasComponent from '../components/ListObrasComponent';
import AddObraComponent from '../components/AddObraComponent';
import AssignJefeObraComponent from '../components/AssignJefeObraComponent';
import AssignRolComponent from '../components/AssignRolComponent';
import LogoutComponent from '../components/LogoutComponent';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route exact path='/home' element={<IndexAdminComponent />} />
      <Route exact path='/personas' element={<ListPersonasComponent />} />
      <Route exact path='/add-persona' element={<AddPersonaComponent />} />
      <Route exact path='/edit-persona/:id' element={<AddPersonaComponent />} />
      <Route exact path='/obras' element={<ListObrasComponent />} />
      <Route exact path='/add-obra' element={<AddObraComponent />} />
      <Route exact path='/edit-obra/:id' element={<AddObraComponent />} />
      <Route exact path='/assign-jefeObra/:id' element={<AssignJefeObraComponent />} />
      <Route exact path='/assign-rol' element={<AssignRolComponent />} />
      <Route exact path='/assign-rol/:id' element={<AssignRolComponent />} />
      <Route exact path='/logout' element={<LogoutComponent />} />
    </Routes>
  );
};

export default AdminRoutes;