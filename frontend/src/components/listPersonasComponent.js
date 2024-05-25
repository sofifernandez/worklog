import React, { useEffect, useState } from 'react'
import PersonaService from '../services/PersonaService'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';

export const ListPersonasComponent = () => {

    const [personas, setPersonas] = useState([])

    const listarPersonas = () =>{
        PersonaService.getAllPersonas().then(res => {
            setPersonas(res.data)
        }).catch(error => {
            console.log(error)
        })
    }

    useEffect(() => {
        listarPersonas()
    }, [])

    const deletePersona = (personaId) => {
        PersonaService.deletePersona(personaId).then((res) => {
            listarPersonas()
        }).catch(e => {
            console.log(e)
        })
    }

    return (
        <div className='container'>
            <h2 className='text-center'>Lista de personas</h2>
            <Link to='/add-persona' className='btn btn-primary mb-2' >Agregar Persona </Link>
            <table className='table table-bordered table-striped'>
                <thead>
                    <th>Id</th>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Cedula</th>
                    <th>Fecha Nacimiento</th>
                    <th>Activo</th>
                    <th>Acciones</th>
                </thead>
                <tbody>
                    {personas.map(p =>
                        <tr key={p.id}>
                            <td >{p.id}</td>
                            <td >{p.nombre}</td>
                            <td >{p.apellido}</td>
                            <td >{p.ci}</td>
                            <td >{p.fechaNacimiento}</td>
                            <td>
                                <FontAwesomeIcon
                                    icon={faCircle}
                                    style={{ color: p.activo ? 'green' : 'red' }}
                                />
                            </td>
                            <td >
                                <Link className='btn btn-info' to={`/edit-persona/${p.id}`}>Actualizar</Link>
                                <button className='btn btn-danger ml-2' onClick={() => deletePersona(p.id)}>Eliminar</button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div >
    )
}
export default ListPersonasComponent
