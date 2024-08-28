import React from 'react';
import { Route, Routes } from 'react-router-dom';
import IndexAdminComponent from '../components/Home/IndexAdminComponent';
import ListPersonasComponent from '../components/ListPersonasComponent';
import AddOrEditPersonaComponent from '../components/AddOrEditPersonaComponent';
import ListObrasComponent from '../components/ListObrasComponent';
import AddObraComponent from '../components/AddObraComponent';
import AssignJefeObraComponent from '../components/AssignJefeObraComponent';
import AssignRolComponent from '../components/AssignRolComponent';
import ChangePassword from '../components/functionalComponents/ChangePassword';
import AddRainToObra from '../components/AddRainToObra'
import AddOrModifyJornalComponent from '../components/AddOrModifyJornalComponent';
import DeleteJornalComponent from '../components/DeleteJornalComponent';
import GenerarReporteComponent from '../components/GenerarReporteComponent';
import BuscarJornalComponent from '../components/BuscarJornalComponent';
import JornalesParaConfirmarAdminComponent from '../components/functionalComponents/JornalesParaConfirmarAdminComponent';

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
      <Route exact path='/modify-jornal/:id' element={<AddOrModifyJornalComponent />} />
      <Route exact path='/add-jornal/' element={<AddOrModifyJornalComponent />} />
      <Route exact path='/delete-jornal/:id' element={<DeleteJornalComponent />} />
      <Route exact path='/resetpassword/:id' element={<ChangePassword />} />
      <Route exact path='/add-rain' element={<AddRainToObra/>}/>
      <Route exact path='/reporte' element={<GenerarReporteComponent/>}/>
      <Route exact path='/buscar-jornal' element={<BuscarJornalComponent showTrabajadores={true} adminView={true}/>}/>
      <Route exact path='/confirmar-jornal' element={<JornalesParaConfirmarAdminComponent/>}/>
    </Routes>
  );
};

export default AdminRoutes;