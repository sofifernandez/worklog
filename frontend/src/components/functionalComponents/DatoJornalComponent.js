import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { faCloudRain, faE, faArrowRightFromBracket, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faCircle, faClock, faPencil } from '@fortawesome/free-solid-svg-icons';
import { format, subHours } from 'date-fns';
import ConfirmarJornalComponent from './ConfirmarJornalComponent.js'
import TimeModal from './TimeModalComponent.js'
import JornalService from '../../services/JornalService.js';
import Swal from 'sweetalert2';



const DatoJornalComponent = ({ jornal, adminView, jefeView, confirmar, onError, onSuccess }) => {

    const [modalShow, setModalShow] = useState(false);
    const [modalType, setModalType] = useState('');
    const [currentJornalId, setCurrentJornalId] = useState(null);

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
        return `${hours}:${minutes}`;
    };

    const getClassName = () => {
        if (jornal.tipoJornal.id === 1) return 'table-light';
        if (jornal.tipoJornal.id === 2) return 'table-primary';
        if (jornal.tipoJornal.id === 3) return 'table-warning';
        return 'error-class';
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
        let motivo = ''
        if (type === 'horaFin') {
            updatedJornal.horaFin = time;
            updatedJornal.horaComienzo = formatTimeWithOffset(jornal.horaComienzo, -3);
            motivo = 'Trabajador no marcó salida'
        } else if (type === 'horaComienzo') {
            updatedJornal.horaComienzo = time;
            updatedJornal.horaFin = formatTimeWithOffset(jornal.horaFin, -3);
            motivo = 'Trabajador no marcó entrada'
        }

        try {
            await JornalService.updateJornal(currentJornalId, motivo, updatedJornal);

            Swal.fire({
                title: `Jornal actualizado con éxito`,
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
                timerProgressBar: true,
                didClose: () => {
                    window.location.reload();
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
            <tr key={jornal.id} className={getClassName()}>

                {/*----- NOMBRE -------- */}
                {(adminView || jefeView) && (<th className="text-center">{jornal.persona.nombre} {jornal.persona.apellido} </th>)}

                {/*----- TIPO -------- */}
                <td className="text-center lluvia" >
                    {jornal.tipoJornal.id === 1 && <FontAwesomeIcon className=' btn btn-dark divSymbol' icon={faClock} title='Común' />}
                    {jornal.tipoJornal.id === 2 && <FontAwesomeIcon className=' btn btn-dark divSymbol' icon={faCloudRain} title='Lluvia' />}
                    {jornal.tipoJornal.id === 3 && <FontAwesomeIcon className=' btn btn-dark divSymbol' icon={faE} title='Extra' />}
                </td>
                {/*----- FECHA -------- */}
                <td className="text-center">{formatDate(jornal.fechaJornal)}</td>
                {/*----- OBRA -------- */}
                <td className="text-center">{jornal.obra.nombre}</td>
                {/*----- HORA COMIENZO -------- */}
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

                {/*----- HORA FIN -------- */}
                <td className="text-center">
                    {jornal.horaFin && (
                        formatTime(jornal.horaFin)
                    )}

                    {!jornal.horaFin && (adminView || jefeView) && (
                        <button
                            className="btn btn-danger"
                            onClick={() => openModal(jornal.id, 'horaFin')}
                        >
                            Agregar salida
                        </button>
                    )}
                </td>
                {/*----- STATUS CONFIRMADO -------- */}
                {(adminView || jefeView) && (
                    <td className="text-center">
                        {jornal.confirmado ? (
                            <FontAwesomeIcon
                                icon={faCircle}
                                style={{ color: 'green' }}
                            />
                        ) : (
                            <ConfirmarJornalComponent
                            jornal={jornal}
                            onError={onError}
                            onSuccess={onSuccess}
                        />
                        )}
                    </td>
                )}
                {/*----- ACCIONES -------- */}
                {adminView && (
                    <td className="text-center">
                        <Link title='Modificar' className='btn btn-outline-info m-1' to={`/modify-jornal/${jornal.id}`}><FontAwesomeIcon icon={faPencil} /></Link>
                        <Link title='Eliminar' className='btn btn-outline-danger m-1' to={`/delete-jornal/${jornal.id}`}><FontAwesomeIcon icon={faTrash} /></Link>

                    </td>
                )}

                {jefeView && (
                    <td className="text-center">
                        {!jornal.confirmado && (
                            <Link title='Modificar' className='btn btn-info m-1' to={`/modify-jornal/${jornal.id}`}><FontAwesomeIcon icon={faPencil} /></Link>
                        )}
                    </td>
                )}
            </tr>

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

export default DatoJornalComponent;









