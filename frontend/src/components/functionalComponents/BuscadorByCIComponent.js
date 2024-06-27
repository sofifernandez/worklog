import React, { useState } from 'react'
import PersonaService from '../../services/PersonaService';

const BuscadorByCIComponent = ({ onPersonaFound, onMensajeError, onCancelar }) => {
    
    const [cedula, setCedula] = useState('');

    const getPersonaByCI = async () => {
        try {
            if (cedula === undefined || cedula === "") {
                onMensajeError('Ingresa una cédula')
            } else {
                const result = await PersonaService.getPersonaByCI(cedula);
                if (onPersonaFound) {
                    onPersonaFound(result.data);
                }
            }

        } catch (error) {
            if (error.response && error.response.status === 404) {
                onMensajeError(error.response.data);
            } else {
                onMensajeError('Ocurrió un error');
            }
        }
    }

    
    const cancelar=()=>{
        setCedula('')
        onPersonaFound(null)
        onMensajeError(null)
        onCancelar()
    }



    return (
        <form className='row align-center justify-content-center mx-0 px-0'>
            <h2 className="mb-3 text-center">Buscar Persona</h2>
            <div className="form-floating mx-auto mb-3 col-12 col-lg-5">
                <input type="text" className="form-control" id="floatingInput" onChange={(e) => setCedula(e.target.value)} value={cedula} />
                <label className='px-4' htmlFor="floatingInput">Cédula</label>
            </div>
            <div className='row justify-content-center'>
                <button className="btn btn-primary col-12 col-lg-2 ms-lg-3 mb-3" type="button" onClick={getPersonaByCI}>Buscar</button>
                <button className="btn btn-danger col-12 py-2 ms-lg-3 mb-3 col-lg-2" type="button" onClick={cancelar}>Cancelar</button>
            </div>
        </form>
    );
};

export default BuscadorByCIComponent;









