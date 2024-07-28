import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext';
import ObraService from '../services/ObraService';
import PersonaService from '../services/PersonaService';
import JornalService from '../services/JornalService';
import JefeObraService from '../services/JefeObraService';
import DatePicker from 'react-datepicker';
import TimePicker from 'react-time-picker';
import { useNavigate, useParams } from 'react-router-dom';
import { format, setHours, setMinutes, addHours } from 'date-fns';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import ContainerBuscadorByCIComponent from './functionalComponents/ContainerBuscadorByCIComponent';
import ErrorMessage from './functionalComponents/ErrorMessageComponent';
import SuccessMessage from './functionalComponents/SuccessMessageComponent';
import Swal from 'sweetalert2';


export const ModifyJornalComponent = () => {
    const { id } = useParams()
    const { personaRolLoggeado } = useAuth();
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState();
    const [obra, setObra] = useState();
    const [obrasActivas, setObrasActivas] = useState();
    const [fechaJornal, setFechaJornal] = useState();
    const [horaComienzo, setHoraComienzo] = useState(format(new Date(), 'HH:mm:ss'));
    const [horaFin, setHoraFin] = useState();
    const [tipoJornal, setTipoJornal] = useState();
    const [radioSelection, setRadioSelection]=useState('radio_1_hora')
    const [trabajadoresSugeridos, setTrabajadoresSugeridos] = useState();
    const [trabajadoresSeleccionados, setTrabajadoresSeleccionados] = useState([]);
    const [persona, setPersona] = useState();
    const [mensajeError, setMensajeError] = useState([]);
    const [mensajeSuccess, setMensajeSuccess] = useState([]);
    const [personaFound, setPersonaFound] = useState(null); 
    const [seleccionarTodos, setSeleccionarTodos]=useState(false)
    /*---- VARIABLES TIPO TOGGLE-------------- */
    const [buscarTrabajador, setBuscarTrabajador] = useState(false)
    const [horaComienzoManual, setHoraComienzoManual] = useState(true)
    const [horaFinManual, setHoraFinManual] = useState(false)
    const [modificado, setModificado] = useState()
    const [confirmado, setConfirmado] = useState()
    const [motivo, setMotivo] = useState()
    const [otroMotivo, setOtroMotivo] = useState('')

    const handleFetchError = (error, currentErrors) => {
        const newErrors = [...(currentErrors || [])]; // Create a copy of currentErrors or initialize as empty array
        console.log(error)
        newErrors.push(error.response?.data || 'ERROR AL GUARDAR');
        return newErrors;
    };

    const handleFetchSuccess = (response, currentMessages) => {
        const newMessagges = [...(currentMessages || [])]; // Create a copy of currentErrors or initialize as empty array
        console.log(response)
        newMessagges.push(response?.response?.data || 'ÉXITO');
        return newMessagges;
    };

    useEffect(() => {
      if(id){
        JornalService.getJornalById(id).then((res) => {
            setObra(res.data.obra)
            setFechaJornal(res.data.fechaJornal)
            setHoraComienzo(format(res.data.horaComienzo, 'HH:mm:ss'))
            setPersona(res.data.persona)
            setTipoJornal(res.data.tipoJornal)
            setModificado(res.data.modificado)
            setConfirmado(res.data.confirmado)
            if (res.data.horaFin){
                setHoraFin(format(res.data.horaFin, 'HH:mm:ss'))
            }
        }).catch(e => {
            console.log(e)
        })
      }
    }, [id])

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


    /*useEffect(() => {
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
            setHoraComienzo('7:30:00')
            setHoraFin('16:30:00');
        }
        if (radioSelection === 'radio_manual') {
            setHoraComienzoManual(true)
            setHoraFinManual(true)
        }
    }, [horaComienzo, radioSelection]);
*/
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
            await JornalService.validateDatos(persona, obra, fechaJornal, horaComienzo, horaFin, tipoJornal, modificado, confirmado)
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

        // Update jornal
        const horaComienzoFormatted = fechaJornal + 'T' + horaComienzo;
        const horaFinFormatted = fechaJornal + 'T' + horaFin;
        const jornal = { persona, obra, fechaJornal, horaComienzo: horaComienzoFormatted, horaFin: horaFinFormatted, tipoJornal, modificado, confirmado}
        var motivoDefinitivo = '';
        if (motivo === 'Otros') {motivoDefinitivo =  otroMotivo;}else{motivoDefinitivo = motivo}
        JornalService.updateJornal(id, motivoDefinitivo, jornal).then((res) => {  
            let timerInterval;
            Swal.fire({
               title: 'Jornal Modificado con éxito',
               timer: 2500,
               timerProgressBar: true,
               didOpen: () => {
                   Swal.showLoading();
                },
               willClose: () => {
                clearInterval(timerInterval);
               }
               }).then((result) => {
                 if (result.dismiss === Swal.DismissReason.timer) {
                   navigate('/modify-jornal/'+id);
                }
               });
               navigate('/modify-jornal/'+id);
        }).catch(error => {
            if (error.response) {
                setMensajeError(error.response.data);
            }else if (error.request) {
                setMensajeError('No hay respuesta del servidor');
            }else{
                setMensajeError(error.message);
            }
        });
        
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

    const handleSetPersona = (persona) => {
        setPersona(persona)
        setBuscarTrabajador(false);
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

    const handleSeleccionarTodos = (e) => {
        e.preventDefault();
        seleccionarTodos && setSeleccionarTodos(false);
        !seleccionarTodos && setSeleccionarTodos(true);
    }

    const handleTipoJornal = (tipoJornal) => {
        switch (tipoJornal) {        
            case 1:
                setTipoJornal({id:1,tipoJornal:"COMUN"})
                break;  
            case 2:
                setTipoJornal({id:2,tipoJornal:"LLUVIA"})
                break; 
            case 3:
                setTipoJornal({id:3,tipoJornal:"EXTRA"}); 
          }
    }


    return (
        <div className='d-flex justify-content-center align-items-center mt-3 row'>
            <div className='card cardForm col-lg-8'>
                <div className='card-header'>
                    <h2 className='text-center'>Modificar jornal</h2>
                </div>
                <div className='card-body'>
                    <form>
                        {/*--------- OBRA/S--------------------------- */}
                        {isAdmin ?
                            obra && (
                            <div className='form-group mt-3'>
                                <label className='form-label labelCard'>Obra</label>
                                <select className="form-select col-5" aria-label="Default select example" onChange={(e) => setObra(e.target.value)}>
                                    <option defaultValue={obra.id}>{obra.nombre}</option>
                                    {obrasActivas && (
                                        obrasActivas.map(obra => (
                                            <option key={obra.id} value={obra.id}>
                                                {obra.nombre}
                                            </option>
                                        ))
                                    )}
                                </select>
                            </div>
                            )
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
                                onChange={date => setFechaJornal(format(date, 'yyyy-MM-dd'))}
                                className='form-control'
                                dateFormat='yyyy-MM-dd'
                                value={fechaJornal}
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
                        {!id && (
                        <div className='form-group mt-3'>
                            <input type="radio" className="btn-check" name="options-outlined" id="radio_1_hora" autoComplete="off" onChange={(e) => setRadioSelection(e.target.id)} defaultChecked />
                            <label className="btn btn-outline-primary mx-1 my-1" htmlFor="radio_1_hora">1 hora</label>

                            <input type="radio" className="btn-check" name="options-outlined" id="radio_2_hora" autoComplete="off" onChange={(e) => setRadioSelection(e.target.id)} />
                            <label className="btn btn-outline-primary mx-1 my-1" htmlFor="radio_2_hora">2 horas</label>

                            <input type="radio" className="btn-check" name="options-outlined" id="radio_all_day" autoComplete="off" onChange={(e) => setRadioSelection(e.target.id)} />
                            <label className="btn btn-outline-primary mx-1 my-1" htmlFor="radio_all_day">Día completo</label>

                            <input type="radio" className="btn-check " name="options-outlined" id="radio_manual" autoComplete="off" onChange={(e) => setRadioSelection(e.target.id)} />
                            <label className="btn btn-outline-primary mx-1 my-1" htmlFor="radio_manual">Ingreso manual</label>
                        </div>
                        )}

                        {/*--------- HORA FIN--------------------------- */}
                        {(horaFinManual || id) && (
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
                            {!id && (<label className='form-label me-4 labelCard'>Trabajadores</label>)}
                            {!id && (<button className='btn btn-outline-primary' onClick={(e) => handleSeleccionarTodos(e)}>Todos</button>)}
                            {id && (<label className='form-label me-4 labelCard'>Trabajador</label>)}
                            {!id && (trabajadoresSugeridos?.length > 0) && (
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

                            {!id && trabajadoresSugeridos?.length === 0 && (
                                <div className='alert alert-light' role='alert'>No hay sugerencias para los parámetros ingresados. Agregue trabajores de forma manual.</div>
                            )}

                            {id && persona &&           
                                (<label className="form-label me-4 border d-inline p-2 justify-content-center">
                                    {persona.nombre} {persona.apellido}
                                </label>)
                            }

                            {!id && !buscarTrabajador && (<div className='btn btn-secondary' onClick={handleBuscar}>Buscar</div>)}
                            {/* id && !buscarTrabajador && (<div className='btn btn-secondary' onClick={handleBuscar}>Cambiar</div>) Se desahabilita para que no se pueda cambiar el trabajador, en todo caso se debería borrar el jornal y crear uno nuevo*/}
                        </div>
                        {/*--------- BUSCADOR--------------------------- */}
                        {buscarTrabajador && !id && (
                            <div className='row justify-content-center'>
                                <ContainerBuscadorByCIComponent onPersonaFound={handlePersonaFound} onCancelar={cancelarBusqueda} minimalData={true} handleRowClick={(e) => agregarALista(e)}></ContainerBuscadorByCIComponent>
                            </div>)
                        }
                        {buscarTrabajador && id && (
                            <div className='row justify-content-center'>
                                <ContainerBuscadorByCIComponent onPersonaFound={handlePersonaFound} onCancelar={cancelarBusqueda} minimalData={true} handleRowClick={(e) => handleSetPersona(e)}></ContainerBuscadorByCIComponent>
                            </div>)
                        }
                        {/*--------- TIPO JORNAL--------------------------- */}
                        {tipoJornal && (
                        <div className='form-group mt-3'>

                            <label className='form-label me-4 labelCard'>Tipo de Jornal</label>

                            <input type="radio" className="btn-check" name="options-outlined" id="tj_comun" autoComplete="off" checked={tipoJornal.id === 1} onChange={(e) => handleTipoJornal(1)} />
                            <label className="btn btn-outline-primary mx-1 my-1" htmlFor="tj_comun">Común</label>

                            <input type="radio" className="btn-check" name="options-outlined" id="tj_extra" autoComplete="off" checked={tipoJornal.id === 3} onChange={(e) => handleTipoJornal(3)} />
                            <label className="btn btn-outline-primary mx-1 my-1" htmlFor="tj_extra">Extra</label>
                        </div>
                        )}
                        {/*--------- MOTIVO --------------------------- */}
                        {id && (
                        <div className='form-group mt-3'>
                            <label className='form-label me-4 labelCard'>Motivo del cambio</label>
                            <select className="form-select col-5" aria-label="Default select example" onChange={(e) => setMotivo(e.target.value)}>
                                    <option value='Horario de Entrada Incorrecto'>Trabajador no marcó salida</option>
                                    <option value='Horario de Entrada Incorrecto'>Trabajador no marcó entrada</option>
                                    <option value='Horario de Entrada Incorrecto'>Horario de Entrada Incorrecto</option>
                                    <option value='Horario de Salida Incorrecto'>Horario de Salida Incorrecto</option>
                                    <option value='Fecha Incorrecta'>Fecha Incorrecta</option>
                                    <option value='Cambio de Obra'>Cambio de Obra</option>
                                    <option value='Otros'>Otros</option>
                            </select>
                        </div>  
                        )}
                        {(motivo == 'Otros') && (
                            <div className='form-group mt-3'>
                                <label className='form-label me-4'>Especifique:</label>
                                <input type='text' name='otrosmotivos' className='form-control' value={otroMotivo} onChange={(e) => setOtroMotivo(e.target.value)}/>
                            </div>
                        )}
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

export default ModifyJornalComponent;