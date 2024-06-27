import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import React, { useState, useEffect } from 'react'
import { format } from 'date-fns';
import ObraService from '../../services/ObraService'
import JornalService from '../../services/JornalService';
import { useAuth } from '../../context/AuthContext';
import PersonaService from '../../services/PersonaService';

const BuscadorJornalComponent = ({ onJornalesFound, onMensajeError, onCancelar }) => {
    const { personaRolLoggeado } = useAuth();

    const [fechaDesde, setFechaDesde] = useState("");
    const [fechaHasta, setFechaHasta] = useState("");
    const [obraSeleccionada, setObraSeleccionada] = useState("0");
    const [obras, setObras] = useState();
    const [trabajadorId, setTrabajadorId] = useState("0")
    const [trabajadoresActivos, setTrabajadoresActivos] = useState()
    const [isRolConAutorizacion, setIsRolConAutorizacion] = useState()
    


    useEffect(() => {
        fetchObras()
        if (personaRolLoggeado.personaRol.rol.rol === "TRABAJADOR") {
            setTrabajadorId(personaRolLoggeado.id)
            setIsRolConAutorizacion(false)
        }
        if (personaRolLoggeado.personaRol.rol.rol === "ADMINISTRADOR" || personaRolLoggeado.personaRol.rol.rol === "JEFE_OBRA") {
            setIsRolConAutorizacion(true)
            fetchTrabajadoresActivos()
        }

    }, [])


    const fetchObras = () => {
        ObraService.getAllObras().then(res => {
            setObras(res.data)
        }).catch(error => {
            onMensajeError(error.response.data)
        })
    }

    const fetchTrabajadoresActivos = () => {
        PersonaService.getAllTrabajadoresActivos().then(res => {
            const sortedData = res.data.sort((a, b) => a.apellido.localeCompare(b.apellido));
            setTrabajadoresActivos(sortedData);
        }).catch(error => {
            console.log(error)
            onMensajeError(error.response.data);
        });
    }



    const getJornalesPorFiltros = async () => {
        console.log('click')
        try {
            const result = await JornalService.getJornalesByFiltros(fechaDesde, fechaHasta, obraSeleccionada, trabajadorId);
            console.log(result)
            console.log(onJornalesFound)
            if (onJornalesFound) {
                console.log(result.data)
                onJornalesFound(result.data);
            }
        } catch (error) {
            console.log(error.response)
            if (error.response && error.response.status === 404) {
                onMensajeError(error.response.data);
            } else {
                onMensajeError('Ocurrió un error');
            }
        }
    }

    const cancelar = () => {
        setFechaDesde()
        setFechaHasta()
        setObraSeleccionada()
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

                        {isRolConAutorizacion &&
                            (
                                <div className='row form-group mt-3'>
                                    <label className='form-label'>Trabajador</label>
                                    <select className="form-select col-5" aria-label="Default select example" onChange={(e) => setTrabajadorId(e.target.value)}>
                                        <option defaultValue="0">TODOS</option>
                                        {trabajadoresActivos && (
                                            trabajadoresActivos.map(t => (
                                                <option key={t.id} value={t.id}>
                                                    {t.apellido}, {t.nombre}
                                                </option>
                                            ))
                                        )}
                                    </select>
                                </div>
                            )
                        }
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