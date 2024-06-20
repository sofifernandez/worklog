import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';

const LogoutComponent = () => {
  const { setPersonaRolLoggeado } = useAuth();
  const navigate = useNavigate();

  const handleLogOut = () => {
    let timerInterval;
    window.localStorage.removeItem('appJornalesToken');
    localStorage.removeItem('personaRolLoggeado');
    setPersonaRolLoggeado([]);

    Swal.fire({
      title: 'Cerrando sesión...',
      timer: 2000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      },
      willClose: () => {
        clearInterval(timerInterval);
      }
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.timer) {
        navigate('/');
      }
    });

    setTimeout(() => {

    }, 1000);
  };

  return (
      <button onClick={handleLogOut} className="btn btn-danger">
        Salir
      </button>
  );
};

export default LogoutComponent;
