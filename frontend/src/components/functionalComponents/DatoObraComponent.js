import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import JefeObraService from '../../services/JefeObraService';
import ObraService from '../../services/ObraService';
import { useState } from 'react';
import ModalComponent from './ModelComponent';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const DatoObraComponent = ({ obra, onlyRows, onRefrescarDatos }) => {

    const [showModal, setShowModal] = useState(false);
    const [selectedQR, setSelectedQR] = useState(null);

    const openModal = (qrCode) => {
        setSelectedQR(qrCode);
        setShowModal(true);
    };

    const closeModal = () => {
        setSelectedQR(null);
        setShowModal(false);
    };

    const eliminarJefeObra = (jefeObraId) => {
        JefeObraService.deleteJefeObra(jefeObraId).then((res) => {
            onRefrescarDatos()
        }).catch(e => {
            console.log(e)
        })
    }

    const deleteObra = (obraId) => {
        ObraService.deleteObra(obraId).then((res) => {
            onRefrescarDatos()
        }).catch(e => {
            console.log(e)
        })
    }

    return (

        <>
                <tr key={obra.id}>
                     <td className='text-center'>
                        <Link className='btn btnActualizar mx-1' to={`/edit-obra/${obra.id}`}>Actualizar</Link>
                        {/* <button className='btn btn-danger mx-1' onClick={() => deleteObra(obra.id)}>Eliminar</button> */}
                    </td>
                    <td >{obra.nombre}</td>
                    <td >{obra.bps}</td>
                    <td className='text-center'>
                        <FontAwesomeIcon
                            icon={faCircle}
                            style={{ color: obra.activo ? 'green' : 'red' }}
                        />
                    </td>
                    {obra.jefeObra?.activo ?
                        <td className='text-center'>
                            <div className=' px-0'>{obra.jefeObra.persona.nombre} {obra.jefeObra.persona.apellido}</div>
                            <span className=" trashcan px-0">
                                <FontAwesomeIcon icon={faTrash} onClick={() => eliminarJefeObra(obra.jefeObra.id)} />
                            </span>
                            {/* <button className='btn alert-warning mx-3' onClick={() => eliminarJefeObra(obra.jefeObra.id)}>Eliminar</button> */}
                        </td>
                        :
                        <td className='text-center'>
                            <Link className='btn btn-info' to={`/assign-jefeObra/${obra.id}`}>Asignar</Link>
                        </td>}
                    {obra.codigoQR &&
                        <td>
                            <div className="d-flex justify-content-center">
                                <img
                                    src={`data:image/png;base64,${obra.codigoQR}`}
                                    alt="Código QR"
                                    style={{ width: '30px', height: '30px', cursor: 'pointer' }}
                                    onClick={() => openModal(obra.codigoQR)}
                                />
                            </div>
                        </td>
                    }
                </tr>

            <div>
                <ModalComponent show={showModal} handleClose={closeModal} selectedQR={selectedQR} obra={obra}>
                    {selectedQR && <img src={`data:image/png;base64,${selectedQR}`} alt="Código QR Completo" style={{ width: '100%' }} />}
                </ModalComponent>
            </div>
        </>

    );
};

export default DatoObraComponent;
