import { useEffect, useState } from "react";
import JornalService from "../../services/JornalService";
import ContainerDatoJornalComponent from './ContainerDatoJornalComponent';
import ConfirmarJornalComponent from "./ConfirmarJornalComponent";
import ErrorMessage from './ErrorMessageComponent';
import SuccessMessage from './SuccessMessageComponent';
import { useAuth } from '../../context/AuthContext';

export const JornalesParaConfirmarComponent = ({ obra }) => {
    const [jornales, setJornales] = useState([]);
    const [mensajeError, setMensajeError] = useState([]);
    const [mensajeSuccess, setMensajeSuccess] = useState([]);
    const { refreshJornales, setRefreshJornales } = useAuth();
    const hasJornales = jornales.length > 0;

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
        setRefreshJornales(false)
    };

    useEffect(() => {
        fetchJornalesSinConfirmar();
    }, [obra, refreshJornales]);

    const handleFetchError = (error) => {
        setMensajeError(prevErrors => [...prevErrors, error]);
    };

    const handleFetchSuccess = (message) => {
        setMensajeSuccess(prevMessages => [...prevMessages, message]);
        fetchJornalesSinConfirmar();
    };

    const handleAlertCloseError = (index) => {
        setMensajeError(prevErrors => prevErrors.filter((_, i) => i !== index));
    };

    const handleAlertCloseSuccess = (index) => {
        setMensajeSuccess(prevMessages => prevMessages.filter((_, i) => i !== index));
        fetchJornalesSinConfirmar();
    };

    return (
        <div className='container mt-5 row divBorder justify-content-center'>
            {obra ? (
                <div>
                    <h4 className='pt-3'>
                        {hasJornales ? `Jornales para confirmar de ${obra.nombre}` : `${obra.nombre}: no tiene jornales para confirmar`}
                    </h4>
                    {hasJornales && (
                        <>
                            <div className='row justify-content-center px-0'>
                                <ContainerDatoJornalComponent
                                    jornales={jornales.slice(0, 10)}
                                    adminView={true}
                                    confirmar={true}
                                    /* onError={handleFetchError}
                                    onSuccess={handleFetchSuccess} */
                                />
                            </div>
                            <div className='row justify-content-center px-0'>
                                <ConfirmarJornalComponent
                                    jornales={jornales}
                                    onError={handleFetchError}
                                    onSuccess={handleFetchSuccess}
                                />
                            </div>
                        </>
                    )}
                    <div className='row justify-content-center mt-4'>
                        {mensajeError.length > 0 && <ErrorMessage mensajeError={mensajeError} handleAlertClose={handleAlertCloseError} />}
                        {mensajeSuccess.length > 0 && <SuccessMessage mensajeSuccess={mensajeSuccess} handleAlertClose={handleAlertCloseSuccess} />}
                    </div>
                </div>
            ) : (
                <h2 className='text-center'>No tienes obra asignada</h2>
            )}
        </div>
    );
};

export default JornalesParaConfirmarComponent;
