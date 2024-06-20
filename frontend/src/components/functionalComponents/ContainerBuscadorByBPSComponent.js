import React, { useState } from 'react'
import BuscadorByBPSComponent from './BuscadorByBPSComponent';
import DatoObraComponent from './DatoObraComponent'

const ContainerBuscadorByBPSComponent = ({ onObraFound, onCancelar }) => {
    const [obra, setObra] = useState('');
    const [mensajeError, setMensajeError] = useState('')

    const handleObraFound = (persona) => {
        setObra(persona);
        onObraFound(persona)
    };

    const handleMensajeError = (mensaje) => {
        setMensajeError(mensaje)
    }

    const volver = () => {
        setObra(null)
        setMensajeError(null)
    }

    const handleCancelar=()=>{
        setMensajeError(null)
        onCancelar()
    }


    return (
        <div>
            {!obra && (<div className='row justify-content-center'>
                <BuscadorByBPSComponent onObraFound={handleObraFound} onMensajeError={handleMensajeError} onCancelar={handleCancelar} />
            </div>)}
            {obra && (
                <div className='row row justify-content-center'>
                    <h5 className='px-0'>Resultado:</h5>
                    <DatoObraComponent obra={obra}/>
                    <button className='btn btn-secondary col-2' onClick={volver}> Volver a buscar</button>
                </div>
            )}
            {mensajeError && <div className='alert alert-light' role='alert'>{mensajeError}</div>}
        </div>

    );
};

export default ContainerBuscadorByBPSComponent;









