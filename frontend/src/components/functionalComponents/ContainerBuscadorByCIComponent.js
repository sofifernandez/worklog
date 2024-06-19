import React, { useState } from 'react'
import BuscadorByCedulaComponent from './BuscadorByCIComponent';

const ContainerBuscadorByCIComponent = ({ onPersonaFound, onPersonaRolFound }) => {
    const [persona, setPersona] = useState('');
    const [personaRol, setPersonaRol] = useState('');
    const [mensajeError, setMensajeError] = useState('')



    const handlePersonaFound = (persona) => {
        setPersona(persona);
        onPersonaFound(persona)
    };
    const handlePersonaRolFound = (personaRol) => {
        setPersonaRol(personaRol);
        onPersonaRolFound(personaRol)
    }

    const handleMensajeRolNotFound = (mensaje) => {
        setMensajeError(mensaje)
    }

    const volver = () => {
        setPersona(null)
        setPersonaRol(null)
        onPersonaFound(null)
        onPersonaRolFound(null)
    }



    return (
        <div>
            {!persona && (<div className='col-12 col-lg-6 row justify-content-center'>
                <BuscadorByCedulaComponent onPersonaFound={handlePersonaFound} onPersonaRolFound={handlePersonaRolFound} onVolver={volver} onMensajeErrorPersonaRolNotFound={handleMensajeRolNotFound} />
            </div>)}
        </div>

    );
};

export default ContainerBuscadorByCIComponent;









