import React, { useEffect, useState } from 'react'
import PersonaService from '../services/PersonaService'
import PersonaRolService from '../services/PersonaRolService'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faPenToSquare } from '@fortawesome/free-solid-svg-icons';

export const ListPersonasComponent = () => {

    const [personas, setPersonas] = useState([])
    const [roles, setRoles] = useState({}); // State to store roles


    const listarPersonas = () =>{
        PersonaService.getAllPersonas().then(res => {
            setPersonas(res.data)
            res.data.forEach(persona => {
            fetchPersonaRol(persona.ci);
            });
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

    const fetchPersonaRol = (cedula) => {
        PersonaRolService.getPersonaRolActivoByCI(cedula)
            .then(res => {
                setRoles(prevRoles => ({
                    ...prevRoles,
                    [cedula]: res.data ? res.data.rol.rol : 'Sin rol' // Assuming rol has a 'nombre' field
                }));
            })
            .catch(error => {
                console.log(error);
                setRoles(prevRoles => ({
                    ...prevRoles,
                    [cedula]: 'Sin rol'
                }));
            });
    };


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
                    <th>Rol actual</th>
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
                            <td>{roles[p.ci] || 'Cargando...'} <Link title='Editar' to ={`/assign-rol/${p.id}`}><span class="badge badge-secondary"><FontAwesomeIcon icon={faPenToSquare} /></span></Link></td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div >
    )
}
export default ListPersonasComponent
