import React, { useState } from 'react';
import BuscadorByCIComponent from './BuscadorByCIComponent';
import DatoPersonaComponent from './DatoPersonaComponent';
import ContainerDatoPersonaComponent from './ContainerDatoPersonaComponent';

const ContainerBuscadorByCIComponent = ({ onPersonaFound, onCancelar, minimalData, handleRowClick }) => {
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
        <div>
            {!personas.length && (
                <div className='row justify-content-center px-0'>
                    <BuscadorByCIComponent onPersonasFound={handlePersonasFound} onMensajeError={handleMensajeError} onCancelar={onCancelar} />
                </div>
            )}
            {personas.length === 1 && (
                <div className='row justify-content-center'>
                    <h5 className='px-0'>Resultado:</h5>
                    <DatoPersonaComponent persona={personas[0]} minimalData={minimalData} handleRowClick={handleRowClick} />
                    <button className='btn btn-secondary col-3' onClick={volver}>Volver a buscar</button>
                </div>
            )}
            {personas.length > 1 && !minimalData && (
                <div className='row justify-content-center'>
                    <h5 className='px-0'>Resultado:</h5>
                    <ContainerDatoPersonaComponent personas={personas} />
                    <button className='btn btn-secondary col-3' onClick={volver}>Volver a buscar</button>
                </div>
            )}
            {personas.length > 1 && minimalData && (
                <div className='row justify-content-center'>
                    <h5 className='px-0'>Resultado:</h5>
                    {personas.map(p => (
                        <DatoPersonaComponent
                            key={p.id} 
                            persona={p}
                            minimalData={minimalData}
                            handleRowClick={handlePersonaClick}
                        />
                    ))}
                    <button className='btn btn-secondary col-3' onClick={volver}>Volver a buscar</button>
                </div>
            )}
            {mensajeError && <div className='alert alert-light' role='alert'>{mensajeError}</div>}
        </div>
    );
};

export default ContainerBuscadorByCIComponent;