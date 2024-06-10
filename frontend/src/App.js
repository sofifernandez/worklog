import './App.css';
import ListPersonasComponent from './components/ListPersonasComponent';
import HeaderComponent from './components/HeaderComponent';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AddPersonaComponent from './components/AddPersonaComponent';
import AssignRolComponent from './components/AssignRolComponent'
import ListObrasComponent from './components/ListObrasComponent';
import AddObraComponent  from './components/AddObraComponent';
import LoginComponent from './components/LoginComponent';
import LogoffComponent from './components/LogoffComponent';
import { initAxiosInterceptors, isValidToken } from "./helpers/AuthHelper"
import AssignJefeObraComponent from './components/AssignJefeObraComponent'

initAxiosInterceptors();

function App() {

  if ((window.localStorage.getItem('appJornalesToken') !== null) && isValidToken() ) {

    return (

      <div className="App">
        <BrowserRouter>
          <HeaderComponent />
          <div className='container-fluid row justify-content-center'>
            <Routes>
                <Route exact path='/personas' element={<ListPersonasComponent/>} ></Route>
                <Route exact path='/add-persona' element={<AddPersonaComponent/>} ></Route>
                <Route exact path='/edit-persona/:id' element={ <AddPersonaComponent/> } ></Route>
                <Route exact path='/obras' element={<ListObrasComponent/>} ></Route>
                <Route exact path='/add-obra' element={<AddObraComponent/>} ></Route>
                <Route exact path='/edit-obra/:id' element={<AddObraComponent/>} ></Route>
                <Route exact path='/assing-jefeObra/:id' element={ <AssignJefeObraComponent/> } ></Route>
                <Route exact path='/assign-rol' element={ <AssignRolComponent/> } ></Route>
                <Route exact path='/assign-rol/:id' element={ <AssignRolComponent/> } ></Route>
                <Route exact path='/logoff' element={ <LogoffComponent/> } ></Route>
            </Routes>
          </div>
        </BrowserRouter>
      </div>

    );

  } else {

    return (

      <div className="Login">
          <BrowserRouter>
              <LoginComponent/>
          </BrowserRouter>
      </div>

  );
}

export default App;
