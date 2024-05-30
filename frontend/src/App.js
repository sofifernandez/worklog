import './App.css';
import ListPersonasComponent from './components/ListPersonasComponent';
import HeaderComponent from './components/HeaderComponent';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AddPersonaComponent from './components/AddPersonaComponent';
import AssignRolComponent from './components/AssignRolComponent'


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <HeaderComponent />
        <div>
          <Routes>
              <Route exact path='/personas' element={<ListPersonasComponent/>} ></Route>
              <Route exact path='/add-persona' element={<AddPersonaComponent/>} ></Route>
              <Route exact path='/edit-persona/:id' element={ <AddPersonaComponent/> } ></Route>
              <Route exact path='/rol' element={ <AssignRolComponent/> } ></Route>
          </Routes>
        </div>
      </BrowserRouter>
    </div>

  );
}

export default App;
