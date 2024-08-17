import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { faCloudRain, faE, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { faCircle, faClock } from '@fortawesome/free-solid-svg-icons';
import { format, subHours } from 'date-fns';
import ConfirmarJornalComponent from './ConfirmarJornalComponent.js'
import TimeModal from './TimeModalComponent.js'
import JornalService from '../../services/JornalService.js';
import Swal from 'sweetalert2';



const DatoPersonaComponent = ({ jornal: initialJornal, onlyRows, adminView, confirmar, onError, onSuccess }) => {

    const [jornal, setJornal] = useState(initialJornal);
    const [modalShow, setModalShow] = useState(false);
    const [modalType, setModalType] = useState('');
    const [currentJornalId, setCurrentJornalId] = useState(null);

    console.log(jornal)

    const formatTime = (timestamp, jornalId) => {
        if (!timestamp) {
            if (!adminView) {
                return (
                    <Link className='btn text-center' to={`/salida-jornal/${jornalId}`} title='Marcar salida'>
                        <FontAwesomeIcon icon={faArrowRightFromBracket} />
                    </Link>
                );
            } else {
                return (<p>--</p>)
            }

        }
        const date = new Date(timestamp);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const day = timestamp.slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() returns 0-11
        const year = date.getFullYear().toString().slice(-2); // get last two digits of the year
        return `${day}/${month}/${year}`;
    };

    const openModal = (jornalId, type) => {
        setCurrentJornalId(jornalId);
        setModalType(type);
        setModalShow(true);
    };

    const closeModal = () => {
        setModalShow(false);
        setCurrentJornalId(null);
        setModalType('');
    };

    const saveTime = async (time, type) => {
        let updatedJornal = { ...jornal };
    
        if (type === 'horaFin') {
            updatedJornal.horaFin = time;
            updatedJornal.horaComienzo = formatTimeWithOffset(jornal.horaComienzo, -3);
        } else if (type === 'horaComienzo') {
            updatedJornal.horaComienzo = time;
            updatedJornal.horaFin = formatTimeWithOffset(jornal.horaFin, -3);
        }
    
        try {
            await JornalService.updateJornal(jornal.id, 'Fata de marcaje', updatedJornal);
    
            Swal.fire({
                title: `Jornal ${type} actualizado con éxito`,
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
                timerProgressBar: true,
                didClose: () => {
                    window.location.reload(); // Recargar la página
                }
            });
    
        } catch (error) {
            if (error.response && error.response.status === 400) {
                Swal.fire({
                    title: 'Error',
                    text: error.response.data ? error.response.data : 'Error al actualizar el jornal',
                    icon: 'error',
                    confirmButtonText: 'Cerrar'
                });
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'Ocurrió un error inesperado',
                    icon: 'error',
                    confirmButtonText: 'Cerrar'
                });
            }
        }
    };

    const formatTimeWithOffset = (timestamp, offset) => {
        const adjustedTime = subHours(new Date(timestamp), Math.abs(offset));
        return format(adjustedTime, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
    };

    return (

        <>
            {!onlyRows &&

                (
                    <table className='table table-sm table-bordered table-striped mt-3'>
                        <thead>
                            <tr>
                                {adminView && (<th className="text-center">Nombre</th>)}
                                <th className="text-center">Tipo</th>
                                <th className="text-center">Fecha</th>
                                <th className="text-center">Obra</th>
                                <th className="text-center">Ingreso</th>
                                <th className="text-center">Salida</th>
                                {adminView && (<th className="text-center">Confirmado</th>)}
                                {adminView && (<th className="text-center">Acciones</th>)}

                            </tr>
                        </thead>
                        <tbody>
                            <tr key={jornal.id}>
                                {adminView && (<th className="text-center">{jornal.persona.nombre} {jornal.persona.apellido} </th>)}
                                {/* <td ><Link className='btn editarJornal' to={`/edit-jornal/${jornal.id}`} title='Editar'><FontAwesomeIcon icon={faPenToSquare} /></Link></td> */}
                                <td className="text-center lluvia" title='LLuvia'>
                                    {jornal.tipoJornal.id === 1 && <FontAwesomeIcon icon={faCircle} />}
                                    {jornal.tipoJornal.id === 2 && <FontAwesomeIcon icon={faCloudRain} />}
                                    {jornal.tipoJornal.id === 3 && <FontAwesomeIcon icon={faE} />}
                                </td>
                                <td className="text-center">{formatDate(jornal.fechaJornal)}</td>
                                <td className="text-center">{jornal.obra.nombre}</td>
                                <td className="text-center">
                                    {jornal.horaComienzo ? (
                                        formatTime(jornal.horaComienzo)
                                    ) : (
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => openModal(jornal.id, 'horaComienzo')}
                                        >
                                            Agregar Hora de Inicio
                                        </button>
                                    )}
                                </td>

                                <td className="text-center">
                                    {jornal.horaFin ? (
                                        formatTime(jornal.horaFin)
                                    ) : (
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => openModal(jornal.id, 'horaFin')}
                                        >
                                            Agregar Hora de Fin
                                        </button>
                                    )}
                                </td>
                                {adminView && (<td className="text-center">
                                    <Link className='btn btn-info mx-1' to={`/edit-obra/${jornal.id}`}>Modificar</Link>
                                    <button className='btn btn-danger mx-1' onClick={() => formatDate(jornal.id)}>Eliminar</button>
                                </td>)}
                            </tr>
                        </tbody>
                    </table>
                )}

            {onlyRows && (
                <tr key={jornal.id}>
                    {adminView && (<th className="text-center">{jornal.persona.nombre} {jornal.persona.apellido} </th>)}
                    {/* <td ><Link className='btn editarJornal' to={`/edit-jornal/${jornal.id}`} title='Editar'><FontAwesomeIcon icon={faPenToSquare} /></Link></td> */}
                    <td className="text-center lluvia" title='LLuvia'>
                        {jornal.tipoJornal.id === 1 && <FontAwesomeIcon icon={faClock} />}
                        {jornal.tipoJornal.id === 2 && <FontAwesomeIcon icon={faCloudRain} />}
                        {jornal.tipoJornal.id === 3 && <FontAwesomeIcon icon={faE} />}
                    </td>
                    <td className="text-center">{formatDate(jornal.fechaJornal)}</td>
                    <td className="text-center">{jornal.obra.nombre}</td>
                    <td className="text-center">
                        {jornal.horaComienzo ? (
                            formatTime(jornal.horaComienzo)
                        ) : (
                            <button
                                className="btn btn-danger"
                                onClick={() => openModal(jornal.id, 'horaComienzo')}
                            >
                                Agregar Hora de Inicio
                            </button>
                        )}
                    </td>

                    <td className="text-center">
                        {jornal.horaFin ? (
                            formatTime(jornal.horaFin)
                        ) : (
                            <button
                                className="btn btn-danger"
                                onClick={() => openModal(jornal.id, 'horaFin')}
                            >
                                Agregar salida
                            </button>
                        )}
                    </td>
                    {adminView && (<td className="text-center"> <FontAwesomeIcon
                        icon={faCircle}
                        style={{ color: jornal.confirmado ? 'green' : 'red' }}
                    /> </td>)
                    }
                    {adminView && !confirmar && (
                        <td className="text-center">
                            <Link className='btn btn-info mx-1' to={`/modify-jornal/${jornal.id}`}>Modificar</Link>
                            <Link className='btn btn-danger mx-1' to={`/delete-jornal/${jornal.id}`}>Eliminar</Link>
                        </td>
                    )}
                    {adminView && confirmar && (
                        <td className="text-center">
                            <ConfirmarJornalComponent
                                jornal={jornal}
                                onError={onError}
                                onSuccess={onSuccess}
                            />
                        </td>
                    )}
                </tr>

            )
            }
            <TimeModal
                show={modalShow}
                handleClose={closeModal}
                handleSave={saveTime}
                type={modalType}
                fecha={jornal.fechaJornal}
            />
        </>

    );





};

export default DatoPersonaComponent;









