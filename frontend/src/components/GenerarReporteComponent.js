
import ReporteService from "../services/ReporteService";
import React, { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import ContainerBuscadorByCIComponent from './functionalComponents/ContainerBuscadorByCIComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import ObraService from "../services/ObraService";
import ErrorMessage from './functionalComponents/ErrorMessageComponent';

const GenerarReporteComponent = () => {
    const [fechaDesde, setFechaDesde] = useState();
    const [fechaHasta, setFechaHasta] = useState();
    const [obrasSeleccionadas, setObrasSeleccionadas] = useState('');
    const [obras, setObras] = useState([]);
    const [trabajadoresSeleccionados, setTrabajadoresSeleccionados] = useState([]);
    const [personaFound, setPersonaFound] = useState(null);
    const [mensajeError, setMensajeError] = useState([]);
    /*---- VARIABLES TIPO TOGGLE-------------- */
    const [seleccionarTrabajadoresManual, setSeleccionarTrabajadoresManual] = useState(false)
    const [seleccionarAllObras, setSeleccionarAllObras] = useState(false)
    const [seleccionarAllTrabajadores, setSeleccionarAllTrabajadores] = useState(true)

    const generarReporte = async () => {
        try {
            const exportReq = {
                fechaDesde: fechaDesde,
                fechaHasta: fechaHasta,
                obras: obrasSeleccionadas,
                personas: seleccionarAllTrabajadores ? ['0'] : trabajadoresSeleccionados.map(p => p.id)
            }
            console.log(exportReq)
            const response = await ReporteService.getReporteEntreFechas(exportReq);
            // Create a URL for the Blob data
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'jornal_data.xlsx'); // Default file name
            document.body.appendChild(link);
            link.click();

            // Clean up
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.log(error)
            if (error.response && error.response.data instanceof Blob) {
                // Handle Blob error response by converting it to text
                const errorText = await error.response.data.text();
                setMensajeError(errorText);  // Assuming `setMensajeError` is used for displaying the error message
            } else {
                // Handle non-Blob errors (network errors, etc.)
                setMensajeError(error.response.data);
            }

        }
    }

    useEffect(() => {
        if (seleccionarAllObras) {
            setObrasSeleccionadas(obras.map(obra => obra.id));
        } else {
            setObrasSeleccionadas([]);
        }
    }, [seleccionarAllObras, obras]);


    useEffect(() => {
        fechaDesde && fechaHasta && fetchObrasActivasEntreFechas(fechaDesde, fechaHasta);
    }, [fechaDesde, fechaHasta]);

    const fetchObrasActivasEntreFechas = async (fechaDesde, fechaHasta) => {
        try {
            const obrasData = await ObraService.getObrasActivasEntreFechas(fechaDesde, fechaHasta);
            console.log(obrasData)
            setObras(obrasData.data);
        } catch (error) {
            setMensajeError(error.response.data);
        }
    };

    const agregarALista = async (e) => {
        setSeleccionarAllTrabajadores(false)
        setTrabajadoresSeleccionados(prevTrabajadores => {
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

    const handleDeleteTrabajador = (id) => {
        setTrabajadoresSeleccionados(prevState => prevState.filter(t => t.id !== id));
    };

    const handlePersonaFound = (persona) => {
        setPersonaFound(persona)
    }

    const handleCheckboxChangeObras = (event, obraID) => {
        const isChecked = event.target.checked;
        setObrasSeleccionadas((prevSelected) => {
            if (isChecked) {
                // Check if is already in the array
                const alreadySelected = prevSelected.some((selectedObraID) => selectedObraID === obraID);
                if (!alreadySelected) {
                    // Add to the array if not already added
                    return [...prevSelected, obraID];
                } else {
                    return prevSelected;
                }
            } else {
                // Remove from the array
                return prevSelected.filter((selectedObraID) => selectedObraID !== obraID);
            }
        });
    };

    const handleAlertCloseError = (e) => {
        e.preventDefault();
        setMensajeError()
    }

    const cancelar = () => {
        setFechaDesde()
        setFechaHasta()
        setObrasSeleccionadas()
        setTrabajadoresSeleccionados()
    }


    const cancelarBusqueda = () => {
        setSeleccionarTrabajadoresManual(false)
        setPersonaFound(null)
    }

    console.log(seleccionarTrabajadoresManual)

    return (
        <div className='d-flex justify-content-center align-items-center mt-3 row'>
            <div className='card cardForm col-lg-8'>
                <div className='card-header'>
                    <h2 className='text-center'>Generar reporte</h2>
                </div>
                <div className='card-body'>
                    <form>
                        <div className="row form-group mx-auto">
                            {/*--------- FECHA DESDE--------------------------- */}
                            <div className='mt-3 col-md-6 ps-0'>
                                <label className='form-label me-4 labelCard fs-5'>Desde</label>
                                <DatePicker
                                    onChange={date => setFechaDesde(format(date, 'yyyy-MM-dd'))}
                                    className='form-control'
                                    dateFormat='yyyy-MM-dd'
                                    value={fechaDesde}
                                />
                            </div>

                            {/*--------- FECHA HASTA--------------------------- */}
                            <div className='mt-3 col-md-6 ps-0'>
                                <label className='form-label me-4 labelCard fs-5'>Hasta</label>
                                <DatePicker
                                    onChange={date => setFechaHasta(format(date, 'yyyy-MM-dd'))}
                                    className='form-control'
                                    dateFormat='yyyy-MM-dd'
                                    value={fechaHasta}
                                />
                            </div>
                        </div>
                        {/*--------- OBRAS--------------------------- */}
                        <div className=' form-group mx-auto mt-5'>
                            <label className='form-label labelCard fs-5'>Obra</label>
                            {obras?.length === 0 && (
                                <div className="alert alert-secondary py-1 col-8 fs-6 miniAlert" role="alert">Elige fechas de búsqueda para ver las obras disponibles</div>
                            )}
                            {obras?.length > 0 && (
                                <button
                                className={`btn btn-outline-dark col-md-2 mb-1 mx-1 ${seleccionarAllObras ? 'btn-active-dark' : 'btn-inactive-dark'}`}
                                onClick={(e) => { e.preventDefault(); setSeleccionarAllObras(prevState => !prevState); }}>
                                Todas
                            </button>
                            )}
                            
                        </div>

                        {obras?.length > 0 && (
                            <div className="row justify-content-around mb-5">
                               
                                {obras.map(o => (
                                    <div className="form-check col-md-3" key={o.id}>
                                        <input className="form-check-input"
                                            type="checkbox" value={o.id}
                                            id={`flexCheckDefault-${o.id}`}
                                            onChange={(event) => handleCheckboxChangeObras(event, o.id)}
                                            checked={obrasSeleccionadas.some(selectedID => selectedID === o.id)}
                                        />
                                        <label className="form-check-label" htmlFor={`flexCheckDefault-${o.id}`}>
                                            {o.nombre} ({o.bps})
                                        </label>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/*--------- TRABAJADORES--------------------------- */}
                        <div className=' form-group mt-3'>
                            <label className='form-label me-4 labelCard fs-5'>Trabajadores</label>
                            <button
                                className={`btn btn-outline-dark col-md-2 mb-1 mx-1 ${seleccionarAllTrabajadores ? 'btn-active-dark' : 'btn-inactive-dark'}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setSeleccionarTrabajadoresManual(false);
                                    setSeleccionarAllTrabajadores(true)
                                }}>
                                Todos
                            </button>

                            <button
                                className={`btn btn-outline-dark col-md-2 mb-1 mx-1 ${!seleccionarAllTrabajadores ? 'btn-active-dark' : 'btn-inactive-dark'}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setSeleccionarTrabajadoresManual(true);
                                    setSeleccionarAllTrabajadores(false)
                                }}>
                                Buscar
                            </button>
                        </div>

                        {/* SELECCIONADOS */}
                        {trabajadoresSeleccionados?.length > 0 && !seleccionarAllTrabajadores && (
                            <div className='row justify-content-center mx-auto mb-5'>
                                {trabajadoresSeleccionados.map(t => (
                                    <div className="row trabDiv py-2 col-6 col-md-4 mx-1 align-items-center mt-1" key={t.id}>
                                        <div className="px-0 col-10 "
                                            id={`trab-${t.id}`}> {t.nombre} {t.apellido} </div>
                                        <span className="col-2 trashcan">
                                            <FontAwesomeIcon icon={faTrash} onClick={() => handleDeleteTrabajador(t.id)} />
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/*--------- BUSCADOR--------------------------- */}
                        {seleccionarTrabajadoresManual && (
                            <div className='row justify-content-center mt-5'>
                                <ContainerBuscadorByCIComponent onPersonaFound={handlePersonaFound} onCancelar={cancelarBusqueda} minimalData={true} handleRowClick={(e) => agregarALista(e)}></ContainerBuscadorByCIComponent>
                            </div>)
                        }

                        <div className='row justify-content-between mt-5'>
                            <button id="btnGenerar" className="btn btn-primary col-5 col-md-3 ms-3 mb-3" type="button" onClick={generarReporte}>Generar</button>
                            <button className="btn btn-danger col-5 col-md-3 ms-3 mb-3 " type="button" onClick={cancelar}>Cancelar</button>
                        </div>
                    </form>
                    {mensajeError && <ErrorMessage mensajeError={mensajeError} handleAlertClose={(e) => handleAlertCloseError(e)} />}
                </div>
            </div>
        </div>

    );
};

export default GenerarReporteComponent;









