import React, { useState, useEffect } from 'react'
import { useAuth } from './context/AuthContext';
import ObraService from '../services/ObraService';
import PersonaService from '../services/PersonaService';
import JornalService from '../services/JornalService';
import DatePicker from 'react-datepicker';
import TimePicker from 'react-time-picker';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

export const AddRainToObra = () => {
    const { personaRolLoggeado } = useAuth();
    const navigate = useNavigate();

    const [isAdmin, setIsAdmin] = useState();
    const [obra, setObra] = useState();
    const [obrasActivas, setObrasActivas] = useState();
    const [fecha, setFecha] = useState();
    const [horaComienzo, setHoraComienzo] = useState();
    const [horaFin, setHoraFin] = useState();
    const [trabajadoresSugeridos, setTrabajadoresSugeridos] = useState();
    const [idTrabajadoresConfirmados, setIdTrabajadoresConfirmados] = useState([]);
    const [mensajeError, setMensajeError] = useState();


    useEffect(() => {
        if (personaRolLoggeado.personaRol.rol.rol === 'JEFE_OBRA') {
            setIsAdmin(false)
            fetchObraByJefe(personaRolLoggeado.id)
        }
        if (personaRolLoggeado.personaRol.rol.rol === 'ADMINISTRADOR') {
            setIsAdmin(true)
            fetchAllObras()
        }
        const now = new Date();
        const formattedStartTime = format(now, 'HH:mm');
        const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
        const formattedEndTime = format(oneHourLater, 'HH:mm');

        setHoraComienzo(formattedStartTime);
        setHoraFin(formattedEndTime);
    }, [personaRolLoggeado]);

    useEffect(() => {
        fetchTrabajadoresSugeridos(obra.id);
    }, [obra]);


    const fetchObraByJefe = async (id) => {
        try {
            const obraData = await ObraService.getObraByJefeId(id);
            setObra(obraData.data);
        } catch (error) {
            setMensajeError(error.response?.data || 'An error occurred while fetching the data.');
        }
    };

    const fetchAllObras = async () => {
        try {
            const obrasData = await ObraService.getAllObras();
            setObrasActivas(obrasData.data)
        } catch (error) {
            setMensajeError(error.response?.data || 'An error occurred while fetching the data.')
        }
    }


    const fetchTrabajadoresSugeridos = async (obraId) => {
        try {
            const trabajadoresData = await PersonaService.getAllTrabajadoresDeObra(obraId);
            setTrabajadoresSugeridos(trabajadoresData.data);
        } catch (error) {
            setMensajeError(error.response?.data || 'An error occurred while fetching the data.');
        }
    };

    const handleCheckboxChange = (event) => {
        const id = event.target.value;
        setIdTrabajadoresConfirmados((prevSelectedIds) =>
            prevSelectedIds.includes(id)
                ? prevSelectedIds.filter((selectedId) => selectedId !== id)
                : [...prevSelectedIds, id]
        );
    };


    const handleConfirmar = () => {
        if (idTrabajadoresConfirmados.length > 0) {
            idTrabajadoresConfirmados.forEach(async (idTrabajador) => {
                try {
                    const response = await JornalService.agregarHorarioLluvia(idTrabajador.id, obra.id, fecha, horaComienzo, horaFin);
                    const data = await response.json();
                    console.log('Success:', data);
                } catch (error) {
                    setMensajeError('Error:', error);
                }
            });
        }
    };

    const handleCancelar=()=>{
        navigate('/home')
    }


    return (
        <div className='d-flex justify-content-center align-items-center mt-3 row'>
            <div className='card cardForm col-lg-8'>
                <div className='card-header'>
                    <h2 className='text-center'>Agregar horario de lluvia</h2>
                </div>
                <div className='card-body'>
                    <form>
                        <div className='form-group mt-3'>
                            <label className='form-label me-4'>Fecha</label>
                            <DatePicker
                                onChange={date => setFecha(format(date, 'yyyy-MM-dd'))}
                                className='form-control'
                                dateFormat='yyyy-MM-dd'
                                value={fecha}
                            />
                        </div>
                        <div className='form-group mt-3'>
                            <label className='form-label me-4'>Hora comienzo</label>
                            <TimePicker
                                value={horaComienzo}
                                onChange={setHoraComienzo}
                                className='form-control'
                                timeFormat='HH:mm:ss'
                            />
                        </div>

                        <div className='form-group mt-3'>
                            <label className='form-label me-4'>Hora fin</label>
                            <TimePicker
                                value={horaFin}
                                onChange={setHoraFin}
                                className='form-control'
                                timeFormat='HH:mm:ss'
                            />
                        </div>

                        {isAdmin ?
                            <div className='row form-group mt-3'>
                                <label className='form-label'>Obra</label>
                                <select className="form-select col-5" aria-label="Default select example" onChange={(e) => setObra(e.target.value)}>
                                    <option defaultValue="-1">Seleccionar</option>
                                    {obrasActivas && (
                                        obrasActivas.map(obra => (
                                            <option key={obra.id} value={obra.id}>
                                                {obra.nombre}
                                            </option>
                                        ))
                                    )}
                                </select>
                            </div>
                            :
                            <div className='row form-group mt-3'>
                                <label className='form-label'>Obra</label>
                                <select className="form-select col-5" aria-label="Default select example" disabled>
                                    <option defaultValue={obra.id}>{obra.nombre}</option>
                                </select>
                            </div>
                        }

                        <div className='row form-group mt-3'>
                            {trabajadoresSugeridos && (
                                trabajadoresSugeridos.map(t => (
                                    <div className="form-check" key={t.id}>
                                        <input className="form-check-input" 
                                            type="checkbox" value={t.id} 
                                            id={`flexCheckDefault-${t.id}`} 
                                            onChange={handleCheckboxChange} />
                                        <label className="form-check-label"  htmlFor={`flexCheckDefault-${t.id}`}>
                                            {t.apellido}, {t.nombre}
                                        </label>
                                    </div>
                                ))
                            )}
                        </div>


                        <div className='row justify-content-center mt-4'>
                            <button className="btn btn-primary col-5 col-lg-3 ms-3 mb-3" type="button" onClick={handleConfirmar}>Confirmar</button>
                            <button className="btn btn-danger col-5 col-lg-3 ms-3 mb-3 " type="button" onClick={handleCancelar}>Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>
            {mensajeError && <div className='alert alert-light' role='alert'>{mensajeError}</div>}
        </div>
    )
}

export default AddRainToObra;