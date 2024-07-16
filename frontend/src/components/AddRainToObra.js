import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext';
import ObraService from '../services/ObraService';
import PersonaService from '../services/PersonaService';
import JornalService from '../services/JornalService';
import JefeObraService from '../services/JefeObraService';
import DatePicker from 'react-datepicker';
import TimePicker from 'react-time-picker';
import { useNavigate } from 'react-router-dom';
import { format, setHours, setMinutes, addHours } from 'date-fns';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import ContainerBuscadorByCIComponent from './functionalComponents/ContainerBuscadorByCIComponent';
import ErrorMessage from './functionalComponents/ErrorMessageComponent';
import DatoPersonaComponent from './functionalComponents/DatoPersonaComponent';

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
    const [trabajadoresSeleccionados, setTrabajadoresSeleccionados] = useState([]);
    const [mensajeError, setMensajeError] = useState(null);
    const [personaFound, setPersonaFound] = useState(null);
    /*---- VARIABLES TIPO TOGGLE-------------- */
    const [buscarTrabajador, setBuscarTrabajador] = useState(false)
    const [horaComienzoManual, setHoraComienzoManual] = useState(true)
    const [horaFinManual, setHoraFinManual] = useState(false)

    const horasDefault = () => {
        const now = new Date();
        const formattedStartTime = format(now, 'HH:mm');
        const oneHourLater = addHours(now, 1);
        const formattedEndTime = format(oneHourLater, 'HH:mm');
        setHoraComienzo(formattedStartTime);
        setHoraFin(formattedEndTime);
    }

    useEffect(() => {
        if (personaRolLoggeado.personaRol.rol.rol === 'JEFE_OBRA') {
            setIsAdmin(false)
            fetchObraByJefe(personaRolLoggeado.id)
        }
        if (personaRolLoggeado.personaRol.rol.rol === 'ADMINISTRADOR') {
            setIsAdmin(true)
            fetchAllObras()
        }
        const formattedDate = format(new Date(), 'yyyy-MM-dd');
        setFecha(formattedDate);
        horasDefault();
    }, [personaRolLoggeado]);

    useEffect(() => {
        obra && fetchTrabajadoresSugeridos(obra.id, fecha);
    }, [obra, fecha]);

    const fetchObraByJefe = async (id) => {
        try {
            const obraData = await JefeObraService.getObraByJefeId(id);
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


    const fetchTrabajadoresSugeridos = async (obraId, fecha) => {
        try {
            const trabajadoresData = await PersonaService.getTrabajadoresDeObraPorFecha(obraId, fecha);
            setTrabajadoresSugeridos(trabajadoresData.data);
        } catch (error) {
            setMensajeError(error.response?.data || 'An error occurred while fetching the data.');
        }
    };

    const handleCheckboxChange = (event, persona) => {
        const isChecked = event.target.checked;
        setTrabajadoresSeleccionados((prevSelected) => {
            if (isChecked) {
                // Add the persona to the array
                return [...prevSelected, persona];
            } else {
                // Remove the persona from the array
                return prevSelected.filter((selectedPersona) => selectedPersona.id !== persona.id);
            }
        });
    };
    


    const handleConfirmar = () => {
        const errors = [];
        if (trabajadoresSeleccionados.length > 0) {
            trabajadoresSeleccionados.forEach(async (persona) => {
                try {
                    const jornal = { persona, obra, fechaJornal:fecha, horaComienzo, horaFin, modificado:false,tipoJornal: { id: 2 }, confirmado:true }
                    const response = await JornalService.agregarLluvia(jornal);
                    const data = await response.json();
                    console.log('Success:', data);
                } catch (error) {
                    errors.push(error.response.data)
                }
            });
            console.log(errors)
            if (errors.length > 0) {
                setMensajeError(errors);
            }
        } else {
            errors.push('Debes seleccionar al menos a un trabajador')
            setMensajeError(errors)
        }
    };


    const handleCancelar = () => {
        navigate('/home')
    }

    const handleBuscar = () => {
        setBuscarTrabajador(true);
    }

    const handlePersonaFound = (persona) => {
        setPersonaFound(persona)
    }

    const handleRadioSelect = (e) => {
        const radioSelection = e.target.id
        const [hours, minutes] = horaComienzo.split(':').map(Number);
        const parsedDate = setHours(setMinutes(new Date(), minutes), hours);

        if (radioSelection === 'radio_1_hora') {
            const oneHourLater = addHours(parsedDate, 1);
            const formattedEndTime = format(oneHourLater, 'HH:mm');
            setHoraFinManual(false)
            setHoraFin(formattedEndTime)
            setHoraComienzoManual(true)
        }
        if (radioSelection === 'radio_2_hora') {
            const twoHoursLater = addHours(parsedDate, 2);
            const formattedEndTime = format(twoHoursLater, 'HH:mm');
            setHoraFin(formattedEndTime)
            setHoraComienzoManual(true)
            setHoraFinManual(false)
        }
        if (radioSelection === 'radio_all_day') {
            setHoraComienzoManual(false)
            setHoraFinManual(false)
            setHoraComienzo("7:30")
            setHoraFin("16:30");
        }
        if (radioSelection === 'radio_manual') {
            horasDefault(true);
            setHoraComienzoManual(true)
            setHoraFinManual(true)
        }
    }

    const cancelarBusqueda = () => {
        setBuscarTrabajador(false)
        setPersonaFound(null)
    }

    const handleAlertClose = (index) => {
        setMensajeError(prevErrors => prevErrors.filter((_, i) => i !== index));
    };

    const agregarALista = async (e) => {
        setTrabajadoresSugeridos(prevTrabajadores => {
            // Check if personaFound is already in the array
            const exists = prevTrabajadores.some(trabajador => trabajador.id === personaFound.id);
            // If not, add it to the array
            if (!exists) {
                return [...prevTrabajadores, personaFound];
            }
            // Otherwise, return the previous array unchanged
            return prevTrabajadores;
        });
        cancelarBusqueda()
    }


    return (
        <div className='d-flex justify-content-center align-items-center mt-3 row'>
            <div className='card cardForm col-lg-8'>
                <div className='card-header'>
                    <h2 className='text-center'>Agregar horario de lluvia</h2>
                </div>
                <div className='card-body'>
                    <form>
                        {/*--------- OBRA/S--------------------------- */}
                        {isAdmin ?
                            <div className='form-group mt-3'>
                                <label className='form-label labelCard'>Obra</label>
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
                            obra && (
                                <div className='form-group mt-3'>
                                    <label className='form-label labelCard'>Obra</label>
                                    <select className="form-select col-5" aria-label="Default select example" disabled>
                                        <option defaultValue={obra.id}>{obra.nombre}</option>
                                    </select>
                                </div>
                            )
                        }
                        {/*--------- FECHA--------------------------- */}
                        <div className='form-group mt-3'>
                            <label className='form-label me-4 labelCard'>Fecha</label>
                            <DatePicker
                                onChange={date => setFecha(format(date, 'yyyy-MM-dd'))}
                                className='form-control'
                                dateFormat='yyyy-MM-dd'
                                value={fecha}
                            />
                        </div>
                        {/*--------- HORA COMIENZO--------------------------- */}
                        {horaComienzoManual && (
                            <div className='form-group mt-3'>
                                <label className='form-label me-4 labelCard'>Hora comienzo</label>
                                <TimePicker
                                    value={horaComienzo}
                                    onChange={setHoraComienzo}
                                    className='form-control'
                                    timeFormat='HH:mm:ss'
                                />
                            </div>
                        )}

                        {/*--------- OPCIONES HORAS--------------------------- */}
                        <div className='form-group mt-3'>
                            <input type="radio" className="btn-check" name="options-outlined" id="radio_1_hora" autoComplete="off" onChange={handleRadioSelect} />
                            <label className="btn btn-outline-primary mx-1" htmlFor="radio_1_hora">1 hora</label>

                            <input type="radio" className="btn-check" name="options-outlined" id="radio_2_hora" autoComplete="off" onChange={handleRadioSelect} />
                            <label className="btn btn-outline-primary mx-1" htmlFor="radio_2_hora">2 horas</label>

                            <input type="radio" className="btn-check" name="options-outlined" id="radio_all_day" autoComplete="off" onChange={handleRadioSelect} />
                            <label className="btn btn-outline-primary mx-1" htmlFor="radio_all_day">Día completo</label>

                            <input type="radio" className="btn-check " name="options-outlined" id="radio_manual" autoComplete="off" onChange={handleRadioSelect} />
                            <label className="btn btn-outline-primary mx-1" htmlFor="radio_manual">Ingreso manual</label>
                        </div>


                        {/*--------- HORA FIN--------------------------- */}
                        {horaFinManual && (
                            <div className='form-group mt-3'>
                                <label className='form-label me-4 labelCard'>Hora fin</label>
                                <TimePicker
                                    value={horaFin}
                                    onChange={setHoraFin}
                                    className='form-control'
                                    timeFormat='HH:mm:ss'
                                />
                            </div>
                        )

                        }
                        {/*--------- TRABAJADORES--------------------------- */}
                        <div className='form-group mt-3 mb-3'>
                            <label className='form-label me-4 labelCard'>Trabajadores</label>
                            {trabajadoresSugeridos?.length > 0 && (
                                trabajadoresSugeridos.map(t => (
                                    <div className="form-check" key={t.id}>
                                        <input className="form-check-input"
                                            type="checkbox" value={t.id}
                                            id={`flexCheckDefault-${t.id}`}
                                            onChange={(event) => handleCheckboxChange(event, t)} />
                                        <label className="form-check-label" htmlFor={`flexCheckDefault-${t.id}`}>
                                            {t.nombre} {t.apellido}
                                        </label>
                                    </div>
                                ))
                            )}

                            {trabajadoresSugeridos?.length === 0 && (
                                <div className='alert alert-light' role='alert'>No hay sugerencias para los parámetros ingresados. Agregue trabajores de forma manual.</div>
                            )}

                            {!buscarTrabajador && (<div className='btn btn-secondary mt-3' onClick={handleBuscar}>Buscar</div>)}
                        </div>
                        {/*--------- BUSCADOR--------------------------- */}
                        {buscarTrabajador && (
                            <div className='row justify-content-center'>
                                <ContainerBuscadorByCIComponent onPersonaFound={handlePersonaFound} onCancelar={cancelarBusqueda} minimalData={true} handleRowClick={(e) => agregarALista(e)}></ContainerBuscadorByCIComponent>
                            </div>)
                        }

                    </form>
                </div>
                {mensajeError && <ErrorMessage mensajeError={mensajeError} handleAlertClose={(e)=>handleAlertClose(e)} />}
            </div>
            <div className='row justify-content-center mt-4'>
                <button className="btn btn-primary col-5 col-lg-3 ms-3 mb-3" type="button" onClick={handleConfirmar}>Confirmar</button>
                <button className="btn btn-danger col-5 col-lg-3 ms-3 mb-3 " type="button" onClick={handleCancelar}>Cancelar</button>
            </div>
        </div>
    )
}

export default AddRainToObra;