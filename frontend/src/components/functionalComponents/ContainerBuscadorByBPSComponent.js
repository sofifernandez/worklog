import React, { useState } from 'react'
import BuscadorByBPSComponent from './BuscadorByBPSComponent';
import ContainerDatoObraComponent from './ContainerDatoObraComponent'

const ContainerBuscadorByBPSComponent = ({ onObraFound, onCancelar }) => {
    const [obras, setObras] = useState([]);
    const [mensajeError, setMensajeError] = useState('')

    const handleObraFound = (obras) => {
        if (obras?.length === 1) {
            setObras([obras[0]])
            onObraFound(obras[0])
        } else {
            setObras(obras);
        }

    };

    console.log(obras)

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
    const onRefrescarDatos=()=>{}


    return (
        <div className='row justify-content-center mb-5'>
            {!obras?.length && (<div className='row justify-content-center'>
                <BuscadorByBPSComponent onObraFound={handleObraFound} onMensajeError={handleMensajeError} onCancelar={handleCancelar} />
            </div>)}
            {obras?.length > 0 && (
                <div className='row justify-content-center'>
                     <ContainerDatoObraComponent obras={obras} onRefrescarDatos={onRefrescarDatos}></ContainerDatoObraComponent>
                    <button className='btn btn-secondary col-2' onClick={volver}>Volver a buscar</button>
                </div>
            )}

                {mensajeError && <div className='alert alert-danger col-md-8 col-lg-6' role='alert'>{mensajeError}</div>}
        </div>

    );
};

export default ContainerBuscadorByBPSComponent;









