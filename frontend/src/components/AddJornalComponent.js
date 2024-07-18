import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import JornalService from '../services/JornalService';
import ContainerBuscadorByCIComponent from './functionalComponents/ContainerBuscadorByCIComponent';
import ContainerBuscadorByBPSComponent from './functionalComponents/ContainerBuscadorByBPSComponent';
import DatoPersonaComponent from './functionalComponents/DatoPersonaComponent';
import DatoObraComponent from './functionalComponents/DatoObraComponent';
import TimePicker from 'react-time-picker';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import Swal from 'sweetalert2';


export const AddJornalComponent = () => {

    const [persona, setPersona] = useState();
    const [obra, setObra] =useState();
    const [fechaJornal, setFechaJornal] = useState(null)
    const [horaComienzo, setHoraComienzo] = useState(null)
    const [horaFin, setHoraFin] = useState(null)
    const [tipoJornal, setTipoJornal] = useState(null);
    const [mensajeError, setMensajeError] = useState({})
    const [modificado, setModificado] = useState(false)
    const [confirmado, setConfirmado] = useState(true)
    const [personaRol, setPersonaRol] = useState();
    const [personaTemp, setPersonaTemp] = useState();
    const [obraTemp, setObraTemp] = useState();
    const [fechaJornalTemp, setFechaJornalTemp] = useState(null)
    const [horaComienzoTemp, setHoraComienzoTemp] = useState('07:30')
    const [horaFinTemp, setHoraFinTemp] = useState('16:30')
    const [horaComienzoDef, setHoraComienzoDef] = useState(null)
    const [horaFinDef, setHoraFinDef] = useState(null)
    const [tipoJornalTemp, setTipoJornalTemp] = useState(null);
    const navigate = useNavigate()
    // Este hook apunta al parametro de la URL ej jornal/$id
    const { id } = useParams()

    const saveOrUpdateJornal = (e) => {
        e.preventDefault()
        const jornal = { persona, obra, fechaJornal, horaComienzo, horaFin, tipoJornal: { id: tipoJornal }, modificado, confirmado }
        if (id) {
            JornalService.updateJornal(id, jornal).then((res) => {  
                let timerInterval;
                Swal.fire({
                   title: 'Jornal Registrado con éxito',
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
                       navigate('/jornales');
                    }
                   });
               navigate('/jornales');
            }).catch(error => {
                if (error.response && error.response.status === 400) {
                    if (error.response.data === 'Error de integridad de datos') {
                        setMensajeError(error.response.data)
                    }
                }
            })
        } else {
            JornalService.createJornal(jornal).then((res) => {
                console.log(jornal)
                let timerInterval;
                 Swal.fire({
                    title: 'Jornal Registrado con éxito',
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
                        navigate('/jornales');
                     }
                    });
                navigate('/jornales');
            }).catch(error => {
                if (error.response && error.response.status === 400) {
                    if (error.response.data === 'Error de integridad de datos') {
                        setMensajeError(error.response.data)
                    }
                }

            })
        }
    }

    useEffect(() => {
        JornalService.getJornalById(id).then((res) => {
            setPersona(res.data.persona)
            setObra(res.data.obra)
            setFechaJornal(res.data.fechaJornal)
            setHoraComienzo(res.data.horaComienzo)
            setHoraFin(res.data.horaFin)
            setModificado(res.data.modificado)
        }).catch(e => {
            setMensajeError(e.response.data)
        })
    }, [id])

    const title = () => {
        if (id) {
            return <h2 className='text-center'>Actualizar Jornal</h2>
        } else {
            return <h2 className='text-center'>Registrar Jornal</h2>
        }
    }

    const handlePersonaFound = (persona) => {
        setPersonaTemp(persona);
        persona && setPersonaRol(persona.personaRol);
    };

    const seleccionarPersona = (persona) => {
        setPersona(persona);
        persona && setPersonaRol(persona.personaRol);
    };

    const handleObraFound = (obra) => {
        setObraTemp(obra);
    };

    const seleccionarObra = (obra) => {
        setObra(obra);
    };

    const handleHoraComienzo = (horaComienzo) => {
        setHoraComienzoDef(horaComienzo);
        setHoraComienzo(fechaJornal + 'T' + horaComienzo)
    };

    const handleHoraFin = (horaFin) => {
        setHoraFinDef(horaFin);
        setHoraFin(fechaJornal + 'T' + horaFin)
    };

    const tipoJornalTexto = (tipoJornal) => {
        switch (tipoJornal) {
            case 1:
              return 'Común'              
            case 2:
              return 'Lluvia'
            case 3:
              return 'Extra'
            default:
              return 'Error al obtener el tipo de jornal'  
          }
    };

   
    const volver = (e) => {
        navigate('/jornales');
    };

    const volverBuscarPersona = (e) => {
        setPersona(null);
    };

    const cancelar = (e) => {
        e.preventDefault();
        if(tipoJornal){setTipoJornal(null)}
        else if(horaFin){setHoraFin(null)}
        else if(horaComienzo){setHoraComienzo(null)}
        else if(fechaJornal){setFechaJornal(null)}
        else if(obra){setObra(null)}
        else if(obraTemp){setObraTemp(null)}
        else if(persona){setPersona(null)}
        else if(personaTemp){setPersonaTemp(null)}
        else {navigate('/jornales')};
    };



    return (
        <div className='mt-5 row justify-content-center col-11'>
            <div className='card cardForm col-lg-10'>
                <div className='card-header'>
                    {title()}
                </div>
                <div className='card-body'>
                    <form>
                      {/*!persona && (<h5 className='px-0 text-primary'><br />Seleccionar Persona</h5>)*/}
                      {persona && (<h6 className='px-0'>Persona Seleccionada: <span className='px-0 text-secondary'>{persona.nombre} {persona.apellido}</span></h6>)}
                      {!personaTemp && (<div className='row justify-content-center'>
                        <ContainerBuscadorByCIComponent onPersonaFound={handlePersonaFound} onCancelar={volver}></ContainerBuscadorByCIComponent>
                      </div>)}
                        { !persona && personaTemp && (
                            <div className='row justify-content-center'>
                                <DatoPersonaComponent persona={personaTemp} personaRol={personaRol ? personaRol.rol.rol : 'Sin rol'} />
                            <button className="btn btn-success py-2 m-3 col-4" type="submit" onClick={(e) => seleccionarPersona(personaTemp)}>Seleccionar</button><button className="btn btn-danger py-2 m-3 col-4" type="submit" onClick={cancelar}>Atrás</button>
                        </div>
                      )}
                      {/*persona && !obra && (<h5 className='px-0 text-primary'><br />Seleccionar Obra</h5>)*/}
                      {persona && obra && (<h6 className='px-0'>Obra Seleccionada: <span className='px-0 text-secondary'>{obra.nombre}</span></h6>)}
                      {persona && !obraTemp && (<div className='row justify-content-center'>
                        <ContainerBuscadorByBPSComponent onObraFound={handleObraFound} onCancelar={volverBuscarPersona}></ContainerBuscadorByBPSComponent>
                      </div>)}
                         { persona && !obra && obraTemp && (
                            <div className='row row justify-content-center'>
                                <DatoObraComponent obra={obraTemp}/>
                            <button className="btn btn-success py-2 m-3 col-4" type="submit" onClick={(e) => seleccionarObra(obraTemp)}>Seleccionar</button><button className="btn btn-danger py-2 m-3 col-4" type="submit" onClick={cancelar}>Atrás</button>
                        </div>
                      )}
                      {persona && obra && !fechaJornal && (<h5 className='px-0 text-primary'><br />Seleccionar Fecha de Jornal</h5>)}
                      {persona && obra && fechaJornal && (<h6 className='px-0'>Fecha Seleccionada: <span className='px-0 text-secondary'>{fechaJornal}</span></h6>)}
                      {persona && obra && !fechaJornal && (<div className='form-group'>
                            <label className='form-label'>Fecha de Jornal</label>
                            <DatePicker
                                selected={fechaJornalTemp}
                                onChange={date => setFechaJornalTemp(format(date, 'yyyy-MM-dd'))}
                                className='form-control'
                                dateFormat='yyyy-MM-dd'
                            /><br />
                            <button className="btn btn-success py-2 m-3 col-4" type="submit" onClick={(e) => setFechaJornal(fechaJornalTemp)}>Seleccionar</button><button className="btn btn-danger py-2 m-3 col-4" type="submit" onClick={cancelar}>Atrás</button>
                        </div>)}
                      {persona && obra && fechaJornal && !horaComienzo && (<h5 className='px-0 text-primary'><br />Seleccionar Hora de Entrada</h5>)}
                      {persona && obra && fechaJornal && horaComienzo && (<h6 className='px-0'>Hora de Entrada: <span className='px-0 text-secondary'>{horaComienzoDef}</span></h6>)}
                      {persona && obra && fechaJornal && !horaComienzo && (<div className='form-group row row justify-content-center'>
                            <div>
                            <TimePicker 
                                value={horaComienzoTemp}
                                onChange={setHoraComienzoTemp}
                                className='form-control'
                                timeFormat='HH:mm:ss'
                            />
                            </div>
                            <button className="btn btn-success py-2 m-3 col-4" type="submit" onClick={(e) => handleHoraComienzo(horaComienzoTemp)}>Seleccionar</button><button className="btn btn-danger py-2 m-3 col-4" type="submit" onClick={cancelar}>Atrás</button>
                        </div>)}
                      {persona && obra && fechaJornal && horaComienzo && !horaFin && (<h5 className='px-0 text-primary'><br />Seleccionar Hora de Salida</h5>)}
                      {persona && obra && fechaJornal && horaComienzo && horaFin && (<h6 className='px-0'>Hora de Salida: <span className='px-0 text-secondary'>{horaFinDef}</span></h6>)}
                      {persona && obra && fechaJornal && horaComienzo && !horaFin && (<div className='form-group row row justify-content-center'>
                            <div>
                            <TimePicker 
                                value={horaFinTemp}
                                onChange={setHoraFinTemp}
                                className='form-control'
                                timeFormat='HH:mm:ss'
                            />
                            </div>
                            <button className="btn btn-success py-2 m-3 col-4" type="submit" onClick={(e) => handleHoraFin(horaFinTemp)}>Seleccionar</button><button className="btn btn-danger py-2 m-3 col-4" type="submit" onClick={cancelar}>Atrás</button>
                        </div>)}
                      {persona && obra && fechaJornal && horaComienzo && horaFin && !tipoJornal && (<h5 className='px-0 text-primary'><br />Seleccionar Tipo de Jornal</h5>)}
                      {persona && obra && fechaJornal && horaComienzo && horaFin && tipoJornal && (<h6 className='px-0'>Tipo de Jornal: <span className='px-0 text-secondary'>{tipoJornalTexto(tipoJornal)}</span></h6>)}
                      {persona && obra && fechaJornal && horaComienzo && horaFin && !tipoJornal && (<div className='form-group row row justify-content-center'> 
                          <div className="btn-group-vertical col-lg-9 mt-3" aria-label="Basic radio toggle button group">
                            <input type="radio" className="btn-check" name="btnradio" id="btnradio1" value="1" checked={tipoJornalTemp === 1} onChange={(e) => setTipoJornalTemp(1)} />
                            <label className="btn btn-outline-primary botonesRol" htmlFor="btnradio1">Común</label>

                            <input type="radio" className="btn-check" name="btnradio" id="btnradio2" value="2" checked={tipoJornalTemp  === 2} onChange={(e) => setTipoJornalTemp(2)} />
                            <label className="btn btn-outline-primary botonesRol" htmlFor="btnradio2">Lluvia</label>

                            <input type="radio" className="btn-check" name="btnradio" id="btnradio3" value="3" checked={tipoJornalTemp  === 3} onChange={(e) => setTipoJornalTemp(3)} />
                            <label className="btn btn-outline-primary botonesRol" htmlFor="btnradio3">Extra</label>
                          </div>
                            <button className="btn btn-success py-2 m-3 col-4" type="submit" onClick={(e) => setTipoJornal(tipoJornalTemp)}>Seleccionar</button><button className="btn btn-danger py-2 m-3 col-4" type="submit" onClick={cancelar}>Atrás</button>
                        </div>)}
                                          
                      {/*mensajeError && (<div className='alert alert-light' role='alert'>{mensajeError}</div>)*/}
                      {persona && obra && fechaJornal && horaComienzo && horaFin && tipoJornal && (<div className='form-group row row justify-content-center'> 
                            <button className="btn btn-success py-2 m-3 col-3" type="submit" onClick={(e) => saveOrUpdateJornal(e)}>Agregar Jornal</button>
                            <button className="btn btn-info py-2 m-3 col-3" type="submit" onClick={cancelar}>Atrás</button>
                            <button className="btn btn-danger py-2 m-3 col-3" type="submit" onClick={volver}>Cancelar</button>
                        </div>)}
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddJornalComponent

