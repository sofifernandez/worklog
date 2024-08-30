import React from 'react';
import { Route, Routes } from 'react-router-dom';
import IndexJefeComponent from '../components/Home/IndexJefeComponent';
import LogoutComponent from '../components/LogoutComponent';
import ChangePassword from '../components/functionalComponents/ChangePassword';
import QrJornalComponent from '../components/QrJornalComponent';
import AddRainToObra from '../components/AddRainToObra';
import AddOrModifyJornalComponent from '../components/AddOrModifyJornalComponent';
import ListMyJornalesComponent from '../components/ListMyJornalesComponent';
import BuscarJornalComponent from '../components/BuscarJornalComponent';
import ContainerJornalEditorComponent from '../components/functionalComponents/ContainerJornalEditorComponent';

const JefeObraRoutes = () => {
  return (
    <Routes>
      <Route exact path='/' element={<IndexJefeComponent />} />
      <Route exact path='/home' element={<IndexJefeComponent />} />
      <Route exact path='/logout' element={<LogoutComponent />} />
      <Route exact path='/jornalQr/:id' element={<QrJornalComponent/>}/>
      <Route exact path='/resetpassword/:id' element={<ChangePassword />} />
      <Route exact path='/add-rain' element={<AddRainToObra/>}/>
      <Route exact path='/add-jornal/' element={<ContainerJornalEditorComponent />} />
      <Route exact path='/modify-jornal/:id' element={<ContainerJornalEditorComponent />} />
      <Route exact path='/my-jornales' element={<ListMyJornalesComponent/>}/>
      <Route exact path='/buscar-jornal' element={<BuscarJornalComponent jefeView={true} showTrabajadores={true}/>}/>
      <Route exact path='/buscar-my-jornal' element={<BuscarJornalComponent workerView={true}/>}/>
      
    </Routes>
  );
};

export default JefeObraRoutes;