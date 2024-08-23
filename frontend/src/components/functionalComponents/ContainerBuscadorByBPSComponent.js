import React, { useState } from 'react'
import BuscadorByBPSComponent from './BuscadorByBPSComponent';
import DatoObraComponent from './DatoObraComponent'

const ContainerBuscadorByBPSComponent = ({ onObraFound, onCancelar }) => {
    const [obras, setObras] = useState([]);
    const [mensajeError, setMensajeError] = useState('')

    const handleObraFound = (obras) => {
        if (obras.length === 1) {
            setObras([obras[0]])
            onObraFound(obras[0])
        } else {
            setObras(obras);
        }


    };

    const handleMensajeError = (mensaje) => {
        setMensajeError(mensaje)
    }

    const volver = () => {
        setObras(null)
        setMensajeError(null)
    }

    const handleCancelar = () => {
        setMensajeError(null)
        onCancelar()
    }


    return (
        <div>
            {!obras && (<div className='row justify-content-center'>
                <BuscadorByBPSComponent onObraFound={handleObraFound} onMensajeError={handleMensajeError} onCancelar={handleCancelar} />
            </div>)}
            {obras && (
                <div className='row justify-content-center'>
                    <h5 className='px-0'>Resultado:</h5>
                    {obras.map(o => (
                        <DatoObraComponent key={o.id} obra={o} />
                    ))}
                    <button className='btn btn-secondary col-2' onClick={volver}>Volver a buscar</button>
                </div>
            )}

            {mensajeError && <div className='alert alert-light' role='alert'>{mensajeError}</div>}
        </div>

    );
};

export default ContainerBuscadorByBPSComponent;









