import React, { useState } from 'react'
import ObraService from '../../services/ObraService';


const BuscadorByBPS = ({ onObraFound, onMensajeError, onCancelar }) => {
    const [bps, setBPS] = useState('');
    const [valorBusqueda, setValorBusqueda] = useState('');


    const getObraByBPSorNombre = async () => {
        onMensajeError();
        try {
            if (valorBusqueda === undefined || valorBusqueda === "") {
                onMensajeError('Ingresa una Nombre o Numero de obra');
            } else {
                let result;
                // Si el valor es solo números, asumimos que es una cédula
                if (/^\d+$/.test(valorBusqueda)) {
                    result = await ObraService.getObraByBPS(valorBusqueda);
                    onObraFound(result ? [result.data] : []);
                } else {
                    // Si contiene letras, asumimos que es un nombre
                    result = await ObraService.getObraByNombre(valorBusqueda);
                    onObraFound(result.data);
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
        onObraFound(null)
        onMensajeError(null)
        setBPS('')
        onCancelar()
    }

    return (
        <form className='row align-center justify-content-center mx-0 px-0'>
            <h2 className="mb-3 text-center">Buscar Obra</h2>
            <div className="form-floating mb-3 col-12 col-lg-5">
                <input type="text" className="form-control" id="floatingInput" onChange={(e) => setValorBusqueda(e.target.value)} value={valorBusqueda} />
                <label className='px-4' htmlFor="floatingInput">Nombre o Numero de obra</label>
            </div>
            <div className='row justify-content-center'>
                <button className="btn btn-primary col-12 col-lg-2 ms-lg-3 mb-3" type="button" onClick={getObraByBPSorNombre}>Buscar</button>
                <button className="btn btn-danger col-12 py-2 ms-lg-3 mb-3 col-lg-2" type="button" onClick={cancelar}>Cancelar</button>
            </div>
        </form>
    );
};

export default BuscadorByBPS;









