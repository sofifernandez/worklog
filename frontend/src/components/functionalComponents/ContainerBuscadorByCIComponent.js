import React, { useState } from 'react'
import BuscadorByCedulaComponent from './BuscadorByCIComponent';
import DatoPersonaComponent from './DatoPersonaComponent';

const ContainerBuscadorByCIComponent = ({ onPersonaFound, onCancelar, minimalData, handleRowClick }) => {
    const [persona, setPersona] = useState('');
    const [mensajeError, setMensajeError] = useState('')

    const handlePersonaFound = (persona) => {
        setPersona(persona);
        onPersonaFound(persona)
    };
   
    const handleMensajeError = (mensaje) => {
        setMensajeError(mensaje)
    }

    const volver = () => {
        setPersona(null)
        setMensajeError(null)
        onPersonaFound(null)
    }



    return (
        <div>
            {!persona && (<div className='row justify-content-center px-0'>
                <BuscadorByCedulaComponent onPersonaFound={handlePersonaFound} onMensajeError={handleMensajeError} onCancelar={onCancelar} />
            </div>)}
            {persona && (
                <div className='row row justify-content-center'>
                    <h5 className='px-0'>Resultado:</h5>
                    <DatoPersonaComponent persona={persona} minimalData={minimalData} handleRowClick={handleRowClick} />
                    <button className='btn btn-secondary col-3' onClick={volver}> Volver a buscar</button>
                </div>
            )}
            {mensajeError && <div className='alert alert-light' role='alert'>{mensajeError}</div>}
        </div>

    );
};

export default ContainerBuscadorByCIComponent;









