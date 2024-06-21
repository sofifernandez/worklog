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
        <form className='row align-center justify-content-center'>
            <h2 className="mb-3 text-center">Buscar persona</h2>
            <div className="form-floating mb-3 col-12 col-lg-5">
                <input type="text" className="form-control" id="floatingInput" onChange={(e) => setCedula(e.target.value)} value={cedula} />
                <label className='px-4' htmlFor="floatingInput">Cédula</label>
            </div>
            <div className='row justify-content-center'>
                <button className="btn btn-primary col-2 ms-3 mb-3" type="button" onClick={getPersonaByCI}>Buscar</button>
                <button className="btn btn-danger py-2 ms-3 mb-3 col-2" type="button" onClick={cancelar}>Cancelar</button>
            </div>
        </form>
    );
};

export default BuscadorByCIComponent;









