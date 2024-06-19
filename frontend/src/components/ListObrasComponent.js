import React, { useState, useEffect } from 'react'
import ObraService from '../services/ObraService'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import JefeObraService from '../services/JefeObraService';

const ListObrasComponent = () => {

    const [obras, setObras] = useState([])

    const listarObras = () => {
        ObraService.getAllObras().then(res => {
            setObras(res.data)

        }).catch(error => {
            console.log(error)
        })
    }

    const eliminarJefeObra = (jefeObraId) => {
        JefeObraService.deleteJefeObra(jefeObraId).then((res) => {
            window.location.reload();
        }).catch(e => {
            console.log(e)
        })
    }

    useEffect(() => {
        listarObras()
    }, [])

    const deleteObra = (obraId) => {
        ObraService.deleteObra(obraId).then((res) => {
            listarObras()
        }).catch(e => {
            console.log(e)
        })
    }


    return (
        <div className='container mt-5 row justify-content-center'>
            <h2 className='text-center'>Lista de obras</h2>
            <Link to='/add-obra' className='btn btn-primary mb-2 col-lg-9' >Agregar nueva obra </Link>
            <div className='table-responsive col-lg-9'>
                <table className='table table-sm table-bordered table-striped'>
                    <thead>
                        <th>Id</th>
                        <th>Nombre</th>
                        <th>Numero BPS</th>
                        <th>Activo</th>
                        <th>Jefe de Obra</th>
                        <th>Acciones</th>
                    </thead>
                    <tbody>
                        {obras.map(o =>
                            <tr key={o.id}>
                                <td >{o.id}</td>
                                <td >{o.nombre}</td>
                                <td >{o.bps}</td>
                                <td>
                                    <FontAwesomeIcon
                                        icon={faCircle}
                                        style={{ color: o.activo ? 'green' : 'red' }}
                                    />
                                </td>
                                {o.jefeObra?.activo ? 
                                <td className='text-center'>{o.jefeObra.persona.nombre} {o.jefeObra.persona.apellido}
                                    <button className='btn alert-warning mx-3' onClick={() => eliminarJefeObra(o.jefeObra.id)}>Eliminar</button>
                                </td>
                                    :
                                     
                                <td className='text-center'>
                                    <Link className='btn btn-primary' to={`/assign-jefeObra/${o.id}`}>Asignar</Link>
                                    </td>}
                                <td className='text-center'>
                                    {/* {!o.jefeObra?.activo ? <Link className='btn btn-primary' to={`/assign-jefeObra/${o.id}`}>Asignar Jefe de obra</Link> :
                                        <button className='btn alert-warning ml-2' onClick={() => eliminarJefeObra(o.jefeObra.id)}>Eliminar Jefe de obra</button>} */}
                                    <Link className='btn btn-info mx-1' to={`/edit-obra/${o.id}`}>Actualizar</Link>
                                    <button className='btn btn-danger mx-1' onClick={() => deleteObra(o.id)}>Eliminar</button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div >
    )
}

export default ListObrasComponent   