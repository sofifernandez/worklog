import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import React, { useState, useEffect } from 'react'
import { format } from 'date-fns';
import ObraService from '../../services/ObraService'
import JornalService from '../../services/JornalService';
import { useAuth } from '../../context/AuthContext';

const BuscadorJornalComponent = ({ onJornalesFound, onMensajeError, onCancelar }) => {

    const { personaRolLoggeado } = useAuth();
    const [fechaDesde, setFechaDesde] = useState("");
    const [fechaHasta, setFechaHasta] = useState("");
    const [obraSeleccionada, setObraSeleccionada] = useState("0");
    const [obras, setObras] = useState();


    const fetchObras = () => {
        ObraService.getAllObras().then(res => {
            setObras(res.data)
        }).catch(error => {
            console.log(error)
        })
    }

    useEffect(() => {
        fetchObras()
    }, [])

    const getJornalesPorFiltros = async () => {
        try {
            const result = await JornalService.getJornalesByFiltros(fechaDesde, fechaHasta, obraSeleccionada, personaRolLoggeado.id);
            if (onJornalesFound) {
                onMensajeError(null)
                onJornalesFound(result.data);
            }
        } catch (error) {
            console.log(error.response)
            if (error.response && error.response.status === 404) {
                onJornalesFound()
                onMensajeError(error.response.data);
            } else {
                onJornalesFound()
                onMensajeError('Ocurrió un error');
            }
        }
    }

    const cancelar = () => {
        setFechaDesde(null)
        setFechaHasta(null)
        setObraSeleccionada(null)
        onJornalesFound(null)
        onMensajeError(null)
        onCancelar()
    }

    return (
        <div className='d-flex justify-content-center align-items-center mt-3 row'>
            <div className='card cardForm col-lg-8'>
                <div className='card-header'>
                    <h2 className='text-center'>Buscar jornales</h2>
                </div>
                <div className='card-body'>
                    <form>
                        <div className='form-group mt-3'>
                            <label className='form-label me-4'>Desde</label>
                            <DatePicker
                                onChange={date => setFechaDesde(format(date, 'yyyy-MM-dd'))}
                                className='form-control'
                                dateFormat='yyyy-MM-dd'
                                value={fechaDesde}
                            />
                        </div>
                        <div className='form-group mt-3'>
                            <label className='form-label me-4'>Hasta</label>
                            <DatePicker
                                onChange={date => setFechaHasta(format(date, 'yyyy-MM-dd'))}
                                className='form-control'
                                dateFormat='yyyy-MM-dd'
                                value={fechaHasta}
                            />
                        </div>
                        <div className='row form-group mt-3'>
                            <label className='form-label'>Obra</label>
                            <select className="form-select col-5" aria-label="Default select example" onChange={(e) => setObraSeleccionada(e.target.value)}>
                                <option defaultValue="0">TODAS</option>
                                {obras && (
                                    obras.map(obra => (
                                        <option key={obra.id} value={obra.id}>
                                            {obra.nombre}
                                        </option>
                                    ))
                                )}
                            </select>
                        </div>
                        <div className='row justify-content-center mt-4'>
                            <button className="btn btn-primary col-5 col-lg-3 ms-3 mb-3" type="button" onClick={getJornalesPorFiltros}>Buscar</button>
                            <button className="btn btn-danger col-5 col-lg-3 ms-3 mb-3 " type="button" onClick={cancelar}>Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default BuscadorJornalComponent;