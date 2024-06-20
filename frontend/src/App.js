import './App.css';
import HeaderAdminComponent from './components/Headers/HeaderAdminComponent';
import HeaderTrabajadorComponent from './components/Headers/HeaderTrabajadorComponent';
import HeaderJefeComponent from './components/Headers/HeaderJefeComponent';
import { BrowserRouter } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginComponent from './components/LoginComponent';
import LogoutComponent from './components/LogoutComponent'
import { initAxiosInterceptors, isValidToken } from "./helpers/AuthHelper"
import AuthProvider from './context/AuthContext';
import AdminRoutes from './routes/AdminRoutes';
import JefeObraRoutes from './routes/JefeObraRoutes';
import TrabajadorRoutes from './routes/TrabajadorRoutes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

initAxiosInterceptors();

function MainApp() {
  const { personaRolLoggeado } = useAuth();


  const renderRoutes = () => {
    switch (personaRolLoggeado.rol.rol) {
      case 'ADMINISTRADOR':
        return <AdminRoutes />;
      case 'JEFE_OBRA':
        return <JefeObraRoutes />;
      case 'TRABAJADOR':
        return <TrabajadorRoutes />;
      default:
        return null;
    }
  };



  if ((window.localStorage.getItem('appJornalesToken') !== null) && isValidToken()) {
    console.log(personaRolLoggeado.rol.rol)
    return (

      <div className="App justify-content-center">

        {personaRolLoggeado.rol.rol === "ADMINISTRADOR" && (<HeaderAdminComponent />)}
        {personaRolLoggeado.rol.rol === "JEFE_OBRA" && (<HeaderJefeComponent />)}
        {personaRolLoggeado.rol.rol === "TRABAJADOR" && (<HeaderTrabajadorComponent />)}
        {personaRolLoggeado.rol.rol==="NONE" && ( <Routes>
          <Route exact path='/' element={<LoginComponent />} />
          <Route exact path='/logout' element={<LogoutComponent />} />
        </Routes>)}
        <div className='container row justify-content-center mx-auto'>
          {renderRoutes()}
        </div>
      </div>
    );

  } else {

    return (
      <Routes>
        <Route exact path='/' element={<LoginComponent />} />
      </Routes>


    );
  }
}

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <MainApp />
    </BrowserRouter>
    <ToastContainer />
  </AuthProvider>
);

export default App;
