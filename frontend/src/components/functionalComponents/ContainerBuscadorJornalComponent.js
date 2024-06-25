import React, { useState } from 'react'
import BuscadorJornalComponent from './BuscadorJornalComponent';
import ContainerDatoJornalComponent from './ContainerDatoJornalComponent';

const ContainerBuscadorJornalComponent = () => {
    const [jornales, setJornales] = useState();
    const [mensajeError, setMensajeError] = useState()

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
    }


    return (
        <div>
            {!jornales && (<div className='row justify-content-center'>
                <BuscadorJornalComponent onJornalesFound={handleJornalFound} onMensajeError={handleMensajeError} onCancelar={handleCancelar} />
            </div>)}
            {jornales?.length > 0 &&
                (<><div className='table-responsive col-lg-8 mt-2'>
                <ContainerDatoJornalComponent jornales={jornales.slice(0, 10)} />
            </div><div className='btn btn-secondary' onClick={handleVolver}>Volver</div></>   
            )
            }
            {jornales?.length===0 && (
                <><div>No hay resultados</div><div className='btn btn-secondary' onClick={handleVolver}>Volver</div></>
                )}
            {mensajeError && <div className='alert alert-light mt-3' role='alert'>{mensajeError}</div>}
            
        </div>
    );
};

export default ContainerBuscadorJornalComponent;









