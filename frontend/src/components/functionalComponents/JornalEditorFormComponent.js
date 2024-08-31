/* eslint-disable default-case */
import React, { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker';
import TimePicker from 'react-time-picker';
import { format, setHours, setMinutes, addHours } from 'date-fns';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import ContainerPersonaFinderComponent from './ContainerPersonaFinderComponent';



export const JornalEditorFormComponent = ({ isModify, obras, persona, fechaJornal, horaComienzo, horaFin, tipoJornal,
    onSeleccionarObra, onSeleccionarPersona, onSeleccionarFecha, onSeleccionarHoraComienzo,
    onSeleccionarHoraFin, onSeleccionarTipo, onSeleccionarMotivo, onSeleccionarOtroMotivo }) => {

    const [radioSelection, setRadioSelection] = useState('')
    const [internalTimeStart, setInternalTimeStart] = useState(horaComienzo);
    const [internalTimeEnd, setInternalTimeEnd] = useState(horaFin);
    const [dayOfTheWeek, setDayOfTheWeek] = useState();
    // Array of weekdays
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];


    /*---- VARIABLES TIPO TOGGLE-------------- */
    const [buscarTrabajador, setBuscarTrabajador] = useState(false)
    const [motivo, setMotivo] = useState()


    /* SELECCIONAR OBRA */
    const handleSeleccionarObra = (obraID) => {
        onSeleccionarObra(obraID)
    }

    /* SELECCIONAR PERSONA */
    const handleSeleccionarPersona = (persona) => {
        onSeleccionarPersona(persona)
        setBuscarTrabajador(false);
    }

    /* SELECCIONAR FECHA */
    const handleFechaSelect = (date) => {
        //const formattedDate = format(date, 'yyyy-MM-dd'); // Format the date as needed
        onSeleccionarFecha(date); // Pass the new date to the parent
    };

    /* SELECCIONAR HORA COMIENZO */
    const handleSetHoraComienzo = (start) => {
        setInternalTimeStart(start)
        onSeleccionarHoraComienzo(start)
    }

    /* SELECCIONAR HORA FIN */
    const handleSetHoraFin = (end) => {
        setInternalTimeEnd(end)
        onSeleccionarHoraFin(end)
    }

    const handleSeleccionarMotivo = (motivo) => {
        setMotivo(motivo)
        onSeleccionarMotivo(motivo)
    }

    const handleSeleccionarOtroMotivo = (otro) => {
        onSeleccionarOtroMotivo(otro)
    }

    useEffect(() => {
        setInternalTimeStart(horaComienzo)
    }, [horaComienzo])

    useEffect(() => {
        setInternalTimeEnd(horaFin)
    }, [horaFin])

    useEffect(() => {
        !isModify && setRadioSelection('radio_all_day')
        isModify && setRadioSelection('')
    }, [isModify])

    useEffect(() => {
        if (!isModify) {
            const dayOfWeek = fechaJornal ? weekdays[fechaJornal.getDay()] : '';
            setDayOfTheWeek(dayOfWeek)
        }
    }, [fechaJornal, isModify])


    console.log(fechaJornal)


    useEffect(() => {
        if (horaComienzo && horaComienzo != null && horaComienzo !== undefined) {

            const [hours, minutes] = horaComienzo.split(':').map(Number);
            const parsedDate = setHours(setMinutes(new Date(), minutes), hours);

            if (radioSelection === 'radio_1_hora') {
                const oneHourLater = addHours(parsedDate, 1);
                const formattedEndTime = format(oneHourLater, 'HH:mm');
                handleSetHoraFin(formattedEndTime)
            }
            if (radioSelection === 'radio_2_hora') {
                const twoHoursLater = addHours(parsedDate, 2);
                const formattedEndTime = format(twoHoursLater, 'HH:mm');
                handleSetHoraFin(formattedEndTime)
            }
        }
        if (radioSelection === 'radio_all_day') {
            handleSetHoraComienzo('07:00')
            dayOfTheWeek === 'Friday' ? handleSetHoraFin('15:30') : handleSetHoraFin('16:30');
        }
        if (radioSelection === 'radio_manual') {

        }


    }, [horaComienzo, radioSelection, dayOfTheWeek]);




    const handleBuscar = () => {
        setBuscarTrabajador(true);

    }

    const cancelarBusqueda = () => {
        setBuscarTrabajador(false)
    }


    const handleTipoJornal = (tipoJornal) => {
        switch (tipoJornal) {
            case 1:
                onSeleccionarTipo({ id: 1, tipoJornal: "COMUN" })
                break;
            case 2:
                onSeleccionarTipo({ id: 2, tipoJornal: "LLUVIA" })
                break;
            case 3:
                onSeleccionarTipo({ id: 3, tipoJornal: "EXTRA" });
        }
    }


    return (

        <div className='card cardForm col-lg-8'>
            <div className='card-header'>
                <h2 className='text-center'>{!isModify ? 'Agregar jornal' : 'Modificar jornal'}</h2>
            </div>
            <div className='card-body'>
                <form>
                    {/*--------- OBRA/S--------------------------- */}
                    <div className='form-group my-5'>
                        <label className='form-label labelCard fs-5'>Obra</label>
                        <select
                            className="form-select col-5 bg-white"
                            aria-label="Default select example"
                            onChange={(e) => handleSeleccionarObra(e.target.value)}
                            disabled={isModify} // Disable the select when modifying
                        >
                            {/* Map through obras to show each option */}
                            {!isModify && (<option defaultValue>Seleccionar</option>)}
                            {obras?.length > 0 && obras.map(obra => (
                                <option key={obra.id} value={obra.id}>
                                    {obra.nombre}
                                </option>
                            ))}
                        </select>
                    </div>



                    {/*--------- FECHA--------------------------- */}

                    <div className='form-group my-5'>
                        <label className='form-label me-4 labelCard fs-5'>Fecha</label>
                        {!isModify && (
                            <DatePicker
                                selected={fechaJornal} // Set initial date from the parent or null
                                onChange={handleFechaSelect}
                                className='form-control bg-white'
                                dateFormat='dd-MM-yyyy'
                            />
                        )}

                        {isModify && (
                           
                            <input className="form-label me-4 bg-white border d-inline p-2 justify-content-center" defaultValue={fechaJornal} disabled />
                            
                        )}
                    </div>

                    {/*--------- TRABAJADORES--------------------------- */}
                    <div className='form-group my-5 mb-3'>
                        <label className='form-label me-4 labelCard fs-5'>Trabajador</label>
                        {persona &&
                            (<label className="form-label me-4 border rounded bg-white border-dark d-inline p-2 justify-content-center">
                                {persona.nombre} {persona.apellido}
                            </label>)
                        }

                        {!isModify && (
                            <><div className='btn btn-secondary mx-2' onClick={handleBuscar}>Buscar</div>
                                {persona && (<div className='btn btn-secondary mx-2' onClick={handleBuscar}>Cambiar</div>)}
                            </>
                        )}
                    </div>

                    {/*--------- BUSCADOR--------------------------- */}
                    {buscarTrabajador && (
                        <div className='row justify-content-center'>
                            <ContainerPersonaFinderComponent onCancelar={cancelarBusqueda} minimalData={true} handleRowClick={(e) => handleSeleccionarPersona(e)}></ContainerPersonaFinderComponent>
                        </div>)
                    }





                    {/*--------- TIPO JORNAL--------------------------- */}

                    <div className='form-group my-5'>

                        <label className='form-label me-4 labelCard fs-5'>Tipo de Jornal</label>

                        <input type="radio" className="btn-check" name="tipo" id="tj_comun" autoComplete="off" checked={tipoJornal?.id === 1} onChange={(e) => handleTipoJornal(1)} />
                        <label className="btn btn-outline-dark mx-1 my-1" htmlFor="tj_comun">Común</label>

                        <input type="radio" className="btn-check" name="tipo" id="tj_extra" autoComplete="off" checked={tipoJornal?.id === 3} onChange={(e) => handleTipoJornal(3)} />
                        <label className="btn btn-outline-dark mx-1 my-1" htmlFor="tj_extra">Extra</label>

                        {isModify && (
                            <>
                                <input type="radio" className="btn-check" name="tipo" id="tj_lluvia" autoComplete="off" checked={tipoJornal?.id === 2} onChange={(e) => handleTipoJornal(2)} />
                                <label className="btn btn-outline-dark mx-1 my-1" htmlFor="tj_lluvia">Lluvia</label></>
                        )}
                    </div>



                    {/*--------- HORA COMIENZO--------------------------- */}

                    <div className='form-group mt-5'>
                        <label className='form-label me-4 labelCard fs-5'>Hora comienzo</label>
                        <TimePicker
                            value={internalTimeStart}
                            onChange={handleSetHoraComienzo}
                            className='form-control'
                            timeFormat='HH:mm'
                            locale='es'
                            disableClock={true}
                        />
                    </div>


                    {/*--------- OPCIONES HORAS--------------------------- */}

                    {!isModify && (
                        <div className='form-group mb-5'>
                            <input type="radio" className="btn-check" name="options-outlined" id="radio_all_day" checked={radioSelection === 'radio_all_day'} autoComplete="off" onChange={(e) => setRadioSelection(e.target.id)} />
                            <label className="btn btn-outline-dark mx-1 my-1" htmlFor="radio_all_day">Día completo</label>

                            <input type="radio" className="btn-check" name="options-outlined" id="radio_manual" checked={radioSelection === 'radio_manual'} autoComplete="off" onChange={(e) => setRadioSelection(e.target.id)} />
                            <label className="btn btn-outline-dark mx-1 my-1" htmlFor="radio_manual">Manual</label>

                            {(tipoJornal?.id == 2 || tipoJornal?.id == 3) && (
                                <>
                                    <input type="radio" className="btn-check" name="options-outlined" id="radio_1_hora" checked={radioSelection === 'radio_1_hora'} autoComplete="off" onChange={(e) => setRadioSelection(e.target.id)} />
                                    <label className="btn btn-outline-dark mx-1 my-1" htmlFor="radio_1_hora">1 hora</label>
                                    <input type="radio" className="btn-check" name="options-outlined" id="radio_2_hora" checked={radioSelection === 'radio_2_hora'} autoComplete="off" onChange={(e) => setRadioSelection(e.target.id)} />
                                    <label className="btn btn-outline-dark mx-1 my-1" htmlFor="radio_2_hora">2 horas</label></>
                            )}

                        </div>
                    )}

                    {/*--------- HORA FIN--------------------------- */}

                    <div className='form-group my-5'>
                        <label className='form-label me-4 labelCard fs-5'>Hora fin</label>
                        <TimePicker
                            value={internalTimeEnd}
                            onChange={handleSetHoraFin}
                            className='form-control'
                            timeFormat='HH:mm'
                            locale='es'
                            disableClock={true}
                        />
                    </div>


                    {/*--------- MOTIVO --------------------------- */}
                    {isModify && (
                        <div className='form-group my-5'>
                            <label className='form-label me-4 labelCard fs-5'>Motivo del cambio</label>
                            <select className="form-select col-5" aria-label="Default select example" onChange={(e) => handleSeleccionarMotivo(e.target.value)}>
                                <option value='Horario de Entrada Incorrecto'>Trabajador no marcó salida</option>
                                <option value='Horario de Entrada Incorrecto'>Trabajador no marcó entrada</option>
                                <option value='Horario de Entrada Incorrecto'>Horario de Entrada Incorrecto</option>
                                <option value='Horario de Salida Incorrecto'>Horario de Salida Incorrecto</option>
                                <option value='Otros'>Otros</option>
                            </select>
                        </div>
                    )}
                    {(motivo == 'Otros') && (
                        <div className='form-group my-5'>
                            <label className='form-label me-4'>Especifique:</label>
                            <input type='text' name='otrosmotivos' className='form-control' onChange={(e) => handleSeleccionarOtroMotivo(e.target.value)} />
                        </div>
                    )}
                </form>
            </div>
        </div>

    )

}

export default JornalEditorFormComponent;