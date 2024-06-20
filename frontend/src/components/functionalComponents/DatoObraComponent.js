import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import JefeObraService from '../../services/JefeObraService';
import ObraService from '../../services/ObraService';

const DatoObraComponent = ({ obra, onlyRows, onRefrescarDatos }) => {

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
            {!onlyRows &&

                (
                    <table className='table table-sm table-bordered table-striped'>
                        <thead>
                            <tr>
                            <th>Nombre</th>
                            <th>Numero BPS</th>
                            <th>Activo</th>
                            <th>Jefe de Obra</th>
                            <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>

                            <tr key={obra.id}>
                                <td >{obra.nombre}</td>
                                <td >{obra.bps}</td>
                                <td>
                                    <FontAwesomeIcon
                                        icon={faCircle}
                                        style={{ color: obra.activo ? 'green' : 'red' }}
                                    />
                                </td>
                                {obra.jefeObra?.activo ?
                                    <td className='text-center'>{obra.jefeObra.persona.nombre} {obra.jefeObra.persona.apellido}
                                        <button className='btn alert-warning mx-3' onClick={() => eliminarJefeObra(obra.jefeObra.id)}>Eliminar</button>
                                    </td>
                                    :

                                    <td className='text-center'>
                                        <Link className='btn btn-primary' to={`/assign-jefeObra/${obra.id}`}>Asignar</Link>
                                    </td>}
                                <td className='text-center'>
                                    <Link className='btn btn-info mx-1' to={`/edit-obra/${obra.id}`}>Actualizar</Link>
                                    <button className='btn btn-danger mx-1' onClick={() => deleteObra(obra.id)}>Eliminar</button>
                                </td>
                            </tr>

                        </tbody>
                    </table>
                )}

            {onlyRows && (
                <tr key={obra.id}>
                <td >{obra.nombre}</td>
                <td >{obra.bps}</td>
                <td>
                    <FontAwesomeIcon
                        icon={faCircle}
                        style={{ color: obra.activo ? 'green' : 'red' }}
                    />
                </td>
                {obra.jefeObra?.activo ?
                    <td className='text-center'>{obra.jefeObra.persona.nombre} {obra.jefeObra.persona.apellido}
                        <button className='btn alert-warning mx-3' onClick={() => eliminarJefeObra(obra.jefeObra.id)}>Eliminar</button>
                    </td>
                    :

                    <td className='text-center'>
                        <Link className='btn btn-primary' to={`/assign-jefeObra/${obra.id}`}>Asignar</Link>
                    </td>}
                <td className='text-center'>
                    <Link className='btn btn-info mx-1' to={`/edit-obra/${obra.id}`}>Actualizar</Link>
                    <button className='btn btn-danger mx-1' onClick={() => deleteObra(obra.id)}>Eliminar</button>
                </td>
            </tr>

            )
            }

        </>

    );





};

export default DatoObraComponent;









