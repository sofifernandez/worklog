/* import React, { useState } from 'react'
import BuscadorJornalComponent from './BuscadorJornalComponent';
import ContainerDatoJornalComponent from './ContainerDatoJornalComponent';
import ErrorMessage from './ErrorMessageComponent'
import { useNavigate } from 'react-router-dom';

const ContainerBuscadorJornalComponent = ({ adminView }) => {
    const [jornales, setJornales] = useState();
    const [mensajeError, setMensajeError] = useState()
    const navigate = useNavigate();

    const handleJornalFound = (jornales) => {
        setJornales(jornales);
    };

    const handleMensajeError = (mensaje) => {
        setMensajeError(mensaje)
    }

    const handleVolver = () => {
        setJornales(null)
        setMensajeError(null)
    }

    const handleCancelar = () => {
        setMensajeError(null)
        navigate('/home');
    }

    const handleAlertCloseError = (index) => {
        setMensajeError('');
    };

    return (
        <div className='row justify-content-center px-0'>
            {!jornales && (<div className='row justify-content-center px-0'>
                <BuscadorJornalComponent onJornalesFound={handleJornalFound} onMensajeError={handleMensajeError} onCancelar={handleCancelar} />
            </div>)}
            {jornales?.length > 0 &&
                (<div className=' row justify-content-center col-lg-9 mt-2'>
                    <div className='table-responsive mt-2 mx-auto'>
                        <ContainerDatoJornalComponent jornales={jornales.slice(0, 10)} adminView={adminView} />
                    </div>
                    <div>
                        <div className='btn btn-secondary col-12 col-lg-2 mx-auto' onClick={handleVolver}>Volver</div>
                    </div>
                </div>
                )
            }
            {jornales?.length === 0 && (
                <><div>No hay resultados</div><div className='btn btn-secondary' onClick={handleVolver}>Volver</div></>
            )}
            <div className='row justify-content-center mt-4'>
                {mensajeError?.length > 0 && <ErrorMessage mensajeError={mensajeError} handleAlertClose={handleAlertCloseError} />}
            </div>
        </div>
    );
};

export default ContainerBuscadorJornalComponent;









 */