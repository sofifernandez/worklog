import { useEffect, useState } from "react";
import { useAuth } from '../../context/AuthContext';
import JornalService from "../../services/JornalService";
import JefeObraService from "../../services/JefeObraService";
import ContainerDatoJornalComponent from '../functionalComponents/ContainerDatoJornalComponent';
import ConfirmarJornalComponent from "../functionalComponents/ConfirmarJornalComponent";
import ErrorMessage from '../functionalComponents/ErrorMessageComponent'; // Asegúrate de tener este componente
import SuccessMessage from '../functionalComponents/SuccessMessageComponent'; // Asegúrate de tener este componente

export const IndexJefeComponent = () => {
  const [obra, setObra] = useState(null);
  const [jornales, setJornales] = useState([]);
  const [mensajeError, setMensajeError] = useState([]);
  const [mensajeSuccess, setMensajeSuccess] = useState([]);
  const { personaRolLoggeado } = useAuth();

  const fetchObra = async () => {
    try {
      const response = await JefeObraService.getObraByJefeId(personaRolLoggeado.id);
      if (response.data) {
        setObra(response.data);
      }
    } catch (error) {
      console.error('Error fetching obra:', error);
    }
  };

  const fetchJornalesSinConfirmar = async () => {
    if (obra) {
      try {
        const response = await JornalService.getJornalesSinConfirmar(obra.id);
        if (response.data) {
          setJornales(response.data);
        }
      } catch (error) {
        console.error('Error fetching jornales:', error);
      }
    }
  };

  useEffect(() => {
    fetchObra();
  }, [personaRolLoggeado.id]);

  useEffect(() => {
    fetchJornalesSinConfirmar();
  }, [obra]);

  const handleFetchError = (error) => {
    setMensajeError(prevErrors => [...prevErrors, error]);
  };

  const handleFetchSuccess = (message) => {
    setMensajeSuccess(prevMessages => [...prevMessages, message]);
  };

  const handleAlertCloseError = (index) => {
    setMensajeError(prevErrors => prevErrors.filter((_, i) => i !== index));
  };

  const handleAlertCloseSuccess = (index) => {
    setMensajeSuccess(prevMessages => prevMessages.filter((_, i) => i !== index));
  };

  return (
    <div className='container mt-5 row justify-content-center'>
      <h2 className='text-center'>Jornales para confirmar</h2>
      <div className='row justify-content-center px-0'>
        <ContainerDatoJornalComponent
          jornales={jornales.slice(0, 10)}
          adminView={true}
          confirmar={true}
          onError={handleFetchError}
          onSuccess={handleFetchSuccess}
        />
      </div>
      <ConfirmarJornalComponent
        jornales={jornales}
        onError={handleFetchError}
        onSuccess={handleFetchSuccess}
      />
      <div className='row justify-content-center mt-4'>
        {mensajeError.length > 0 && <ErrorMessage mensajeError={mensajeError} handleAlertClose={handleAlertCloseError} />}
        {mensajeSuccess.length > 0 && <SuccessMessage mensajeSuccess={mensajeSuccess} handleAlertClose={handleAlertCloseSuccess} />}
      </div>
    </div>
  );
};

export default IndexJefeComponent;