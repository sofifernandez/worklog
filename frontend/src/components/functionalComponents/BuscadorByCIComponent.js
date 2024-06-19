import React, { useState } from 'react'
import PersonaService from '../../services/PersonaService';
import PersonaRolService from '../../services/PersonaRolService';

const BuscadorByCIComponent = ({ onPersonaFound, onPersonaRolFound, onVolver, onMensajeErrorPersonaRolNotFound }) => {
    const [cedula, setCedula] = useState('');
    const [mensajeError, setMensajeError] = useState('');



    const getPersonaByCI = async () => {
        try {
            if (cedula === undefined || cedula === "") {
                setMensajeError('Ingresa una cédula')
            } else {
                const result = await PersonaService.getPersonaByCI(cedula);
                if (onPersonaFound) {
                    onPersonaFound(result.data);
                    fetchPersonaRol(result.data);
                }
            }

        } catch (error) {
            if (error.response && error.response.status === 404) {
                setMensajeError(error.response.data);
            } else {
                setMensajeError('Ocurrió un error');
            }
        }
    }

    const fetchPersonaRol = async (persona) => {
        try {
            const personaRolData = await getPersonaRolByCI(persona.ci);
            if (onPersonaRolFound) {
                onPersonaRolFound(personaRolData);
            }
        } catch (error) {
            setMensajeError(error.response?.data || 'Ocurrió un error');
        }

    };


    const getPersonaRolByCI = async (cedula) => {
        try {
            const result = await PersonaRolService.getPersonaRolActivoByCI(cedula);
            return result.data;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                onMensajeErrorPersonaRolNotFound(error.response.data)
                return null;
            } else {
                throw error; // Re-throw other errors
            }
        }
    };



    return (
        <form className='row align-center'>
            <h2 className="mb-3 col-11">Buscar persona</h2>
            <div className="form-floating mb-3 col-12 col-lg-9">
                <input type="text" className="form-control" id="floatingInput" onChange={(e) => setCedula(e.target.value)} />
                <label className='px-4' htmlFor="floatingInput">Cédula</label>
            </div>
            <button className="btn btn-primary col-4 ms-3 mb-3" type="button" onClick={getPersonaByCI}>Buscar</button>
            <button className="btn btn-danger py-2 ms-3 mb-3 col-4" type="button" onClick={onVolver}>Volver</button>
            {mensajeError && <div className='alert alert-light col-12 col-lg-9' role='alert'>{mensajeError}</div>}
        </form>
    );
};

export default BuscadorByCIComponent;









