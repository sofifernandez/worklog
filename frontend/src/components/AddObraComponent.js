import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import ObraService from '../services/ObraService';
import Swal from 'sweetalert2';

export const AddObraComponent = () => {

    const [nombre, setNombre] = useState('')
    const [bps, setBps] = useState('')
    const [activo, setActivo] = useState(true)
    const [mensajeError, setMensajeError] = useState({})
    const navigate = useNavigate()
    // Este hook apunta al parametro de la URL ej obra/$id
    const { id } = useParams()

    const saveOrUpdateObra = (e) => {
        e.preventDefault()
        const obra = { nombre, bps, activo }
        if (id) {
            ObraService.updateObra(id, obra).then((res) => {
                let timerInterval;
                Swal.fire({
                   title: 'Obra modificada con éxito',
                   timer: 2000,
                   timerProgressBar: true,
                   didOpen: () => {
                       Swal.showLoading();
                    },
                   willClose: () => {
                    clearInterval(timerInterval);
                   }
                   }).then((result) => {
                     if (result.dismiss === Swal.DismissReason.timer) {
                        navigate('/obras');
                    }
                   });
                navigate('/obras')
            }).catch(error => {
                if (error.response && error.response.status === 400) {
                    if (error.response.data === 'Error de integridad de datos') {
                        setMensajeError({ bps: 'Numero de BPS ya registrado' });
                    } else {
                        setMensajeError(error.response.data)
                    }
                }
            })
        } else {
            ObraService.createObra(obra).then((res) => {
                let timerInterval;
                Swal.fire({
                   title: 'Obra registrada con éxito',
                   timer: 2000,
                   timerProgressBar: true,
                   didOpen: () => {
                       Swal.showLoading();
                    },
                   willClose: () => {
                    clearInterval(timerInterval);
                   }
                   }).then((result) => {
                     if (result.dismiss === Swal.DismissReason.timer) {
                        navigate('/obras');
                    }
                   });
                navigate('/obras')
            }).catch(error => {
                if (error.response && error.response.status === 400) {
                    if (error.response.data === 'Error de integridad de datos') {
                        setMensajeError({ bps: 'Numero de BPS ya registrado' });
                    } else {
                        setMensajeError(error.response.data)
                    }
                }

            })
        }
    }

    useEffect(() => {
        ObraService.getObraById(id).then((res) => {
            setNombre(res.data.nombre)
            setBps(res.data.bps)
            setActivo(res.data.activo)
        }).catch(e => {
            setMensajeError(e.response.data)
        })
    }, [id])

    const handleCheckboxChange = (e) => {
        setActivo(e.target.checked);
    }

    const title = () => {
        if (id) {
            return <h2 className='text-center'>Actualizar Obra</h2>
        } else {
            return <h2 className='text-center'>Registrar Obra</h2>
        }
    }

    return (
        <div className='d-flex justify-content-center align-items-center mt-3 row'>
            <div className='card cardForm col-lg-7'>
                <div className='card-header'>
                    {title()}
                </div>
                <div className='card-body'>
                    <form>
                        <div className='form-group'>
                            <label className='form-label mb-2'>Nombre</label>
                            <input type='text' name='nombre' className='form-control' value={nombre} onChange={(e) => setNombre(e.target.value)} />
                            {mensajeError.nombre && <div className="alert alert-danger mt-2" role="alert">{mensajeError.nombre}</div>}
                        </div>
                        <div className='form-group'>
                            <label className='form-label'>Numero BPS</label>
                            <input type='text' name='bps' className='form-control' value={bps} onChange={(e) => setBps(e.target.value)} />
                            {mensajeError.bps && <div className="alert alert-danger mt-2" role="alert">{mensajeError.bps}</div>}
                        </div>
                        <div className='form-group form-check'>
                            <input type='checkbox' name='activo' className='form-check-input' checked={activo} onChange={handleCheckboxChange} />
                            <label className='form-check-label m-2'>Activo</label>
                        </div>
                        <button className='btn btn-success m-2' onClick={(e) => saveOrUpdateObra(e)}>Guardar</button>
                        <Link to={'/obras'} className='btn btn-danger m-2'>Cancelar</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddObraComponent

