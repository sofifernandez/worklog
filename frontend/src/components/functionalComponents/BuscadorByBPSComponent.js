import React, { useState } from 'react'
import ObraService from '../../services/ObraService';


const BuscadorByBPS = ({ onObraFound, onMensajeError, onCancelar }) => {
    const [bps, setBPS] = useState('');


    const getObraByBPS = async () => {
        try {
            if (bps === undefined || bps === "") {
                onMensajeError('Ingresa un número de BPS')
            } else {
                const result = await ObraService.getObraByBPS(bps);
                console.log(result)
                if (onObraFound) {
                    onObraFound(result.data);
                }
            }

        } catch (error) {
            if (error.response && error.response.status === 404) {
                onMensajeError(error.response.data);
                console.log(error.response.data)
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
        <form className='row align-center justify-content-center'>
            <h2 className="mb-3 text-center">Buscar Obra</h2>
            <div className="form-floating mb-3 col-12 col-lg-5">
                <input type="text" className="form-control" id="floatingInput" onChange={(e) => setBPS(e.target.value)} value={bps} />
                <label className='px-4' htmlFor="floatingInput">BPS</label>
            </div>
            <div className='row justify-content-center'>
                <button className="btn btn-primary col-2 ms-3 mb-3" type="button" onClick={getObraByBPS}>Buscar</button>
                <button className="btn btn-danger py-2 ms-3 mb-3 col-2" type="button" onClick={cancelar}>Cancelar</button>
            </div>
        </form>
    );
};

export default BuscadorByBPS;









