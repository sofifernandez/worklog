import React, { useState } from 'react';
import PersonaFinderComponent from './PersonaFinderComponent';
import ContainerDatoPersonaComponent from './ContainerDatoPersonaComponent';

const ContainerPersonaFinderComponent = ({ onPersonaFound, onCancelar, minimalData, handleRowClick }) => {
    const [personas, setPersonas] = useState([]);
    const [mensajeError, setMensajeError] = useState('');

    const handlePersonasFound = (personas) => {
        if (personas.length === 1) {
            setPersonas([personas[0]]);
            onPersonaFound(personas[0]);
        } else {
            setPersonas(personas);
        }
    };

    const handlePersonaClick = (persona) => {
        onPersonaFound(persona);
        handleRowClick(persona) // Pasa la persona específica al padre 
    };

    const handleMensajeError = (mensaje) => {
        setMensajeError(mensaje);
    };

    const volver = () => {
        setPersonas([]);
        setMensajeError(null);
        onPersonaFound(null);
    };

    return (
        <div className='row row justify-content-center'>
            {!personas.length && (
                <div className='row justify-content-center px-0'>
                    <PersonaFinderComponent onPersonasFound={handlePersonasFound} onMensajeError={handleMensajeError} onCancelar={onCancelar} />
                </div>
            )}
            {personas.length > 0 && (
                <div className='row justify-content-center'>
                    <h5 className='px-0'>Resultado:</h5>
                    <ContainerDatoPersonaComponent personas={personas} minimalData={minimalData} handleRowClick={handlePersonaClick} />
                    <button className='btn btn-secondary col-3' onClick={volver}>Volver a buscar</button>
                </div>
            )}
           
            {mensajeError && <div className='alert alert-danger col-md-8 col-lg-6' role='alert'>{mensajeError}</div>}
        </div>
    );
};

export default ContainerPersonaFinderComponent;