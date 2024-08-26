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
import ContainerPersonaFinderComponent from './functionalComponents/ContainerPersonaFinderComponent';
import ErrorMessage from './functionalComponents/ErrorMessageComponent';
import SuccessMessage from './functionalComponents/SuccessMessageComponent';

export const AddRainToObra = () => {
    const { personaRolLoggeado } = useAuth();
    const navigate = useNavigate();

    const [isAdmin, setIsAdmin] = useState();
    const [obra, setObra] = useState();
    const [obrasActivas, setObrasActivas] = useState();
    const [fechaJornal, setFechaJornal] = useState();
    const [horaComienzo, setHoraComienzo] = useState(format(new Date(), 'HH:mm:ss'));
    const [horaFin, setHoraFin] = useState();
    const [trabajadoresSugeridos, setTrabajadoresSugeridos] = useState([]);
    const [trabajadoresSeleccionados, setTrabajadoresSeleccionados] = useState([]);
    const [mensajeError, setMensajeError] = useState([]);
    const [mensajeSuccess, setMensajeSuccess] = useState([]);
    const [personaFound, setPersonaFound] = useState(null);

    /*---- VARIABLES TIPO TOGGLE-------------- */
    const [radioSelection, setRadioSelection] = useState('radio_1_hora')
    const [seleccionarTodos, setSeleccionarTodos] = useState(false)
    const [buscarTrabajador, setBuscarTrabajador] = useState(false)
    const [horaComienzoManual, setHoraComienzoManual] = useState(true)
    const [horaFinManual, setHoraFinManual] = useState(false)

    const handleFetchError = (error, currentErrors) => {
        const newErrors = [...(currentErrors || [])]; // Create a copy of currentErrors or initialize as empty array
        newErrors.push(error.response?.data || 'ERROR AL GUARDAR');
        return newErrors;
    };

    const handleFetchSuccess = (response, currentMessages) => {
        const newMessagges = [...(currentMessages || [])]; // Create a copy of currentErrors or initialize as empty array
        newMessagges.push(response?.response?.data || 'ÉXITO');
        return newMessagges;
    };


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
        setFechaJornal(formattedDate);
    }, [personaRolLoggeado]);

    useEffect(() => {
        obra && fetchTrabajadoresSugeridos(obra.id, fechaJornal);
    }, [obra, fechaJornal]);


    useEffect(() => {
        const [hours, minutes] = horaComienzo.split(':').map(Number);
        const parsedDate = setHours(setMinutes(new Date(), minutes), hours);

        if (radioSelection === 'radio_1_hora') {
            const oneHourLater = addHours(parsedDate, 1);
            const formattedEndTime = format(oneHourLater, 'HH:mm:ss');
            setHoraFinManual(false)
            setHoraFin(formattedEndTime)
            setHoraComienzoManual(true)
        }
        if (radioSelection === 'radio_2_hora') {
            const twoHoursLater = addHours(parsedDate, 2);
            const formattedEndTime = format(twoHoursLater, 'HH:mm:ss');
            setHoraFin(formattedEndTime)
            setHoraComienzoManual(true)
            setHoraFinManual(false)
        }
        if (radioSelection === 'radio_all_day') {
            setHoraComienzoManual(false)
            setHoraFinManual(false)
            setHoraComienzo('07:30:00')
            setHoraFin('16:30:00');
        }
        if (radioSelection === 'radio_manual') {
            setHoraComienzoManual(true)
            setHoraFinManual(true)
        }
    }, [horaComienzo, radioSelection]);

    useEffect(() => {
        if (seleccionarTodos) {
            setTrabajadoresSeleccionados(trabajadoresSugeridos);
        } else {
            setTrabajadoresSeleccionados([]);
        }
    }, [seleccionarTodos, trabajadoresSugeridos]);


    const fetchObraByJefe = async (id) => {
        try {
            const obraData = await JefeObraService.getObraByJefeId(id);
            setObra(obraData.data);
        } catch (error) {
            setMensajeError((prevErrors) => handleFetchError(error, prevErrors));
        }
    };

    const fetchAllObras = async () => {
        try {
            const obrasData = await ObraService.getAllObras();
            setObrasActivas(obrasData.data)
        } catch (error) {
            setMensajeError((prevErrors) => handleFetchError(error, prevErrors));
        }
    }


    const fetchTrabajadoresSugeridos = async (obraId, fecha) => {
        try {
            const trabajadoresData = await PersonaService.getTrabajadoresDeObraPorFecha(obraId, fecha);
            setTrabajadoresSugeridos(trabajadoresData.data);
        } catch (error) {
            setMensajeError((prevErrors) => handleFetchError(error, prevErrors));
        }
    };

    const handleCheckboxChange = (event, persona) => {
        const isChecked = event.target.checked;
        setTrabajadoresSeleccionados((prevSelected) => {
            if (isChecked) {
                // Check if the persona is already in the array
                const alreadySelected = prevSelected.some((selectedPersona) => selectedPersona.id === persona.id);
                if (!alreadySelected) {
                    // Add the persona to the array if not already added
                    return [...prevSelected, persona];
                } else {
                    return prevSelected;
                }
            } else {
                // Remove the persona from the array
                return prevSelected.filter((selectedPersona) => selectedPersona.id !== persona.id);
            }
        });
    };

    const handleConfirmar = async (e) => {
        setMensajeError([]);
        setMensajeSuccess([])
        const errors = [];
        e.preventDefault();

        try {
            const tipoJornal = { id: 2 }
            await JornalService.validateDatos(trabajadoresSeleccionados[0], obra, fechaJornal, horaComienzo, horaFin, tipoJornal, true, false)
        } catch (error) {
            if (error.response) {
                // Handle server-side errors
                errors.push(error.response.data);
            } else {
                // Handle other JavaScript errors
                errors.push(error.message);
            }

        }

        if (errors.length > 0) {
            setMensajeError(errors);
            return; // Stop further processing
        }

        // Create an array of jornales
        const jornales = trabajadoresSeleccionados.map(persona => {
            const horaComienzoFormatted = fechaJornal + 'T' + horaComienzo;
            const horaFinFormatted = fechaJornal + 'T' + horaFin;
            return {
                persona,
                obra,
                fechaJornal,
                horaComienzo: horaComienzoFormatted,
                horaFin: horaFinFormatted,
                modificado: false,
                tipoJornal: { id: 2, tipoJornal: 'LLUVIA' },
                confirmado: true
            };
        });
        // Process each jornal
        const results = await Promise.all(jornales.map(async (jornal) => {
            try {
                const response = await JornalService.agregarLluvia(jornal);
                return { success: true, response };
            } catch (error) {
                console.log(error)
                return { success: false, error: error || 'An error occurred while processing jornal' };
            }
        }));

        // Separate errors and successful responses
        const successfulResults = results.filter(result => result.success);
        const errorResults = results.filter(result => !result.success);

        // Update mensajeError with errors
        if (errorResults.length > 0) {
            setMensajeError((prevErrors) => {
                let updatedErrors = [...prevErrors];
                errorResults.forEach(result => {
                    updatedErrors = handleFetchError(result.error, updatedErrors);
                });
                return updatedErrors;
            });
        }

        if (successfulResults.length > 0) {
            setMensajeSuccess((prev) => {
                let updated = [...prev];
                successfulResults.forEach(result => {
                    updated = handleFetchSuccess(result, updated);
                });
                return updated;
            });
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

    const cancelarBusqueda = () => {
        setBuscarTrabajador(false)
        setPersonaFound(null)
    }

    const handleAlertCloseError = (index) => {
        setMensajeError(prevErrors => prevErrors.filter((_, i) => i !== index));
    };

    const handleAlertCloseSuccess = (index) => {
        setMensajeSuccess(prevSucess => prevSucess.filter((_, i) => i !== index));
    };


    const agregarALista = (persona) => {
        setTrabajadoresSugeridos(prevTrabajadores => {
            // Verifica si la persona ya está en la lista
            const exists = prevTrabajadores.some(trabajador => trabajador.id === persona.id);
            // Si no está, agrégala a la lista
            if (!exists) {
                return [...prevTrabajadores, persona];
            }
            // De lo contrario, devuelve la lista previa sin cambios
            return prevTrabajadores;
        });
    };

    const handleSeleccionarTodos = (e) => {
        e.preventDefault();
        seleccionarTodos && setSeleccionarTodos(false);
        !seleccionarTodos && setSeleccionarTodos(true);
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
                                <select className="form-select col-5" aria-label="Default select example" 
                                onChange={(e) => {const selectedId = e.target.value;
                                        const selectedObra = obrasActivas.find(obra => obra.id === parseInt(selectedId));
                                        setObra(selectedObra);
                                    }}>
                                    <option defaultValue="-1">Seleccionar</option>
                                    {obrasActivas && (
                                        obrasActivas.map(obra => (
                                            <option key={obra.id} value={obra.id} id= {obra.id}>
                                                {obra.nombre}
                                            </option>
                                        ))
                                    )}
                                </select>
                            </div>
                            :
                            obra && (
                                <div className='form-group mt-5'>
                                    <label className='form-label labelCard'>Obra</label>
                                    <select className="form-select col-5" aria-label="Default select example" disabled>
                                        <option defaultValue={obra.id}>{obra.nombre}</option>
                                    </select>
                                </div>
                            )
                        }
                        {/*--------- FECHA--------------------------- */}
                        <div className='form-group mt-5'>
                            <label className='form-label me-4 labelCard'>Fecha</label>
                            <DatePicker
                                onChange={date => setFechaJornal(format(date, 'yyyy-MM-dd'))}
                                className='form-control'
                                dateFormat='yyyy-MM-dd'
                                value={fechaJornal}
                            />
                        </div>
                        {/*--------- HORA COMIENZO--------------------------- */}
                        {horaComienzoManual && (
                            <div className='form-group mt-5'>
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
                        <div className='form-group mt-2'>
                            <input type="radio" className="btn-check" name="options-outlined" id="radio_1_hora" autoComplete="off" onChange={(e) => setRadioSelection(e.target.id)} defaultChecked />
                            <label className="btn btn-outline-primary mx-1 my-1" htmlFor="radio_1_hora">1 hora</label>

                            <input type="radio" className="btn-check" name="options-outlined" id="radio_2_hora" autoComplete="off" onChange={(e) => setRadioSelection(e.target.id)} />
                            <label className="btn btn-outline-primary mx-1 my-1" htmlFor="radio_2_hora">2 horas</label>

                            <input type="radio" className="btn-check" name="options-outlined" id="radio_all_day" autoComplete="off" onChange={(e) => setRadioSelection(e.target.id)} />
                            <label className="btn btn-outline-primary mx-1 my-1" htmlFor="radio_all_day">Día completo</label>

                            <input type="radio" className="btn-check " name="options-outlined" id="radio_manual" autoComplete="off" onChange={(e) => setRadioSelection(e.target.id)} />
                            <label className="btn btn-outline-primary mx-1 my-1" htmlFor="radio_manual">Ingreso manual</label>
                        </div>


                        {/*--------- HORA FIN--------------------------- */}
                        {horaFinManual && (
                            <div className='form-group mt-5'>
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
                        <div className='form-group mt-5 mb-3'>
                            <label className='form-label me-4 labelCard'>Trabajadores</label>
                            <button className='btn btn-outline-primary mx-3'
                                onClick={(e) => handleSeleccionarTodos(e)}
                                disabled={trabajadoresSugeridos?.length == 0}
                                >Todos</button>
                            {trabajadoresSugeridos?.length > 0 && (
                                trabajadoresSugeridos.map(t => (
                                    <div className="form-check" key={t.id}>
                                        <input className="form-check-input"
                                            type="checkbox" value={t.id}
                                            id={`flexCheckDefault-${t.id}`}
                                            onChange={(event) => handleCheckboxChange(event, t)}
                                            checked={trabajadoresSeleccionados.some(selected => selected.id === t.id)}
                                        />
                                        <label className="form-check-label" htmlFor={`flexCheckDefault-${t.id}`}>
                                            {t.nombre} {t.apellido}
                                        </label>
                                    </div>
                                ))
                            )}

                            {trabajadoresSugeridos?.length === 0 && (
                                <div className='alert alert-secondary' role='alert'>No hay sugerencias para los parámetros ingresados. Agregue trabajores de forma manual.</div>
                            )}

                            {!buscarTrabajador && (<div className='btn btn-secondary mt-3' onClick={handleBuscar}>Buscar</div>)}
                        </div>
                        {/*--------- BUSCADOR--------------------------- */}
                        {buscarTrabajador && (
                            <div className='row justify-content-center'>
                                <ContainerPersonaFinderComponent onPersonaFound={handlePersonaFound} onCancelar={cancelarBusqueda} minimalData={true} handleRowClick={(e) => agregarALista(e)}></ContainerPersonaFinderComponent>
                            </div>)
                        }

                    </form>
                </div>
                {mensajeError && <ErrorMessage mensajeError={mensajeError} handleAlertClose={(e) => handleAlertCloseError(e)} />}
                {mensajeSuccess && <SuccessMessage mensajeSuccess={mensajeSuccess} handleAlertClose={(e) => handleAlertCloseSuccess(e)} />}
            </div>
            <div className='row justify-content-center mt-4'>
                <button className="btn btn-primary col-5 col-lg-3 ms-3 mb-3" type="button" onClick={(e) => handleConfirmar(e)}>Confirmar</button>
                <button className="btn btn-danger col-5 col-lg-3 ms-3 mb-3 " type="button" onClick={handleCancelar}>Cancelar</button>
            </div>
        </div>
    )
}

export default AddRainToObra;