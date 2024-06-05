import React, { useState , useEffect } from 'react'
import ObraService from '../services/ObraService'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';

const ListObrasComponent = () => {

    const [obras, setObras] = useState([])

    const listarObras = () => {
        ObraService.getAllObras().then(res =>{
            setObras(res.data)
        }).catch(error =>{
            console.log(error)
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
    <div className='container'>
            <h2 className='text-center'>Lista de obras</h2>
            <Link to='/add-obra' className='btn btn-primary mb-2' >Agregar nueva obra </Link>
            <table className='table table-bordered table-striped'>
                <thead>
                    <th>Id</th>
                    <th>Nombre</th>
                    <th>Numero BPS</th>
                    <th>Activo</th>
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
                            <td >
                                <Link className='btn btn-info' to={`/edit-obra/${o.id}`}>Actualizar</Link>
                                <button className='btn btn-danger ml-2' onClick={() => deleteObra(o.id)}>Eliminar</button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div >
  )
}

export default ListObrasComponent   