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
    switch (personaRolLoggeado.personaRol.rol.rol) {
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
    console.log(personaRolLoggeado)
    return (

      <div className="App justify-content-center">
        {personaRolLoggeado?.personaRol?.rol?.rol === "ADMINISTRADOR" && (<HeaderAdminComponent />)}
        {personaRolLoggeado?.personaRol?.rol?.rol === "JEFE_OBRA" && (<HeaderJefeComponent />)}
        {personaRolLoggeado?.personaRol?.rol?.rol === "TRABAJADOR" && (<HeaderTrabajadorComponent />)}
        {!personaRolLoggeado && ( <Routes>
          <Route exact path='/' element={<LoginComponent />} />
          <Route exact path='/logout' element={<LogoutComponent />} />
        </Routes>)}
        <div className='container row justify-content-center mx-auto px-0'>
          {renderRoutes()}
        </div>
      </div>
    );

  } else {

    return (
      <LoginComponent />
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
