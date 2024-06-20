import React, { useEffect, useState } from 'react'
import PersonaService from '../services/PersonaService'
import { Link } from 'react-router-dom'
import ContainerBuscadorByCIComponent from './functionalComponents/ContainerBuscadorByCIComponent';
import ContainerDatoPersonaComponent from './functionalComponents/ContainerDatoPersonaComponent';

export const ListPersonasComponent = () => {

    const [personas, setPersonas] = useState([])
    
    const listarPersonas = () => {
        PersonaService.getAllPersonas().then(res => {
            setPersonas(res.data)
        }).catch(error => {
            console.log(error)
        })
    }

    useEffect(() => {
        listarPersonas()
    }, [])

    const handlePersonaFound = () => {};
    const handleCancelar=()=>{};

    return (
        <div className='container mt-5 row justify-content-center'>
            <h1>PERSONAS</h1>
            <h2 className='text-center'>Lista de personas</h2>
            <Link to='/add-persona' className='btn btn-primary mb-2 col-lg-8' >Agregar Persona </Link>
            <div className='table-responsive col-lg-8 mt-2'>
                <ContainerDatoPersonaComponent personas={personas}/>
            </div>
            <div className='mt-5'>
                <ContainerBuscadorByCIComponent onPersonaFound={handlePersonaFound} onCancelar={handleCancelar}></ContainerBuscadorByCIComponent>
            </div>
        </div >
    )
}
export default ListPersonasComponent
