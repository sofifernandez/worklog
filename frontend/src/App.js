import './App.css';
import ListPersonasComponent from './components/ListPersonasComponent';
import HeaderComponent from './components/HeaderComponent';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AddPersonaComponent from './components/AddPersonaComponent';
import AssignRolComponent from './components/AssignRolComponent'
import ListObrasComponent from './components/ListObrasComponent';
import  AddObraComponent  from './components/AddObraComponent';
import AssignJefeObraComponent from './components/AssignJefeObraComponent'


function App() {
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
              <Route exact path='/rol' element={ <AssignRolComponent/> } ></Route>
              <Route exact path='/assing-jefeObra/:id' element={ <AssignJefeObraComponent/> } ></Route>
              
          </Routes>
        </div>
      </BrowserRouter>
    </div>

  );
}

export default App;
