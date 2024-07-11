import React from 'react';
import { Route, Routes } from 'react-router-dom';
import IndexAdminComponent from '../components/Home/IndexAdminComponent';
import ListPersonasComponent from '../components/ListPersonasComponent';
import AddOrEditPersonaComponent from '../components/AddOrEditPersonaComponent';
import ListObrasComponent from '../components/ListObrasComponent';
import AddObraComponent from '../components/AddObraComponent';
import AssignJefeObraComponent from '../components/AssignJefeObraComponent';
import AssignRolComponent from '../components/AssignRolComponent';
import AddJornalComponent from '../components/AddJornalComponent';
import ContainerBuscadorJornalComponent from '../components/functionalComponents/ContainerBuscadorJornalComponent';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route exact path='/' element={<IndexAdminComponent />} />
      <Route exact path='/home' element={<IndexAdminComponent />} />
      <Route exact path='/personas' element={<ListPersonasComponent />} />
      <Route exact path='/add-persona' element={<AddOrEditPersonaComponent />} />
      <Route exact path='/edit-persona/:id' element={<AddOrEditPersonaComponent />} />
      <Route exact path='/obras' element={<ListObrasComponent />} />
      <Route exact path='/add-obra' element={<AddObraComponent />} />
      <Route exact path='/edit-obra/:id' element={<AddObraComponent />} />
      <Route exact path='/assign-jefeObra/:id' element={<AssignJefeObraComponent />} />
      <Route exact path='/assign-rol' element={<AssignRolComponent />} />
      <Route exact path='/assign-rol/:id' element={<AssignRolComponent />} />
      <Route exact path='/jornal' element={<AddJornalComponent />} />
      <Route exact path='/jornal/:id' element={<AddJornalComponent />} />
      <Route exact path='/buscar-jornal' element={<ContainerBuscadorJornalComponent adminView={true}/>}/>
    </Routes>
  );
};

export default AdminRoutes;