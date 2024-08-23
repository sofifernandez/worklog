import React, { useState } from 'react';
import PersonaService from '../../services/PersonaService';

const BuscadorByCIComponent = ({ onPersonasFound, onMensajeError, onCancelar }) => {
    
    const [valorBusqueda, setValorBusqueda] = useState('');

    const getPersonas = async () => {
        onMensajeError();
        try {
            if (valorBusqueda === undefined || valorBusqueda === "") {
                onMensajeError('Ingresa una cédula o nombre');
            } else {
                let result;
                // Si el valor es solo números, asumimos que es una cédula
                if (/^\d+$/.test(valorBusqueda)) {
                    result = await PersonaService.getPersonaByCI(valorBusqueda);
                    onPersonasFound(result ? [result.data] : []);
                } else {
                    // Si contiene letras, asumimos que es un nombre
                    result = await PersonaService.getPersonasByNombre(valorBusqueda);
                    onPersonasFound(result.data);
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

    const cancelar = () => {
        setValorBusqueda('');
        onPersonasFound([]);
        onMensajeError(null);
        onCancelar();
    }

    return (
        <form className='row align-center justify-content-center mx-0 px-0'>
            <h3 className="mb-3 text-center">Buscar Persona</h3>
            <div className="form-floating mx-auto mb-3 col-12 col-md-6 col-xl-5">
                <input type="text" className="form-control" id="floatingInput" onChange={(e) => setValorBusqueda(e.target.value)} value={valorBusqueda} />
                <label className='px-4' htmlFor="floatingInput">Cédula o Nombre</label>
            </div>
            <div className='row justify-content-center'>
                <button className="btn btn-primary col-5 col-md-2 ms-md-3 mb-3" type="button" onClick={getPersonas}>Buscar</button>
                <button className="btn btn-danger col-5 ms-md-3 mb-3 col-md-2" type="button" onClick={cancelar}>Cerrar</button>
            </div>
        </form>
    );
};

export default BuscadorByCIComponent;