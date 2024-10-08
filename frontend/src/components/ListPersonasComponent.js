import React, { useEffect, useState } from 'react'
import PersonaService from '../services/PersonaService'
import { Link } from 'react-router-dom'
import ContainerPersonaFinderComponent from './functionalComponents/ContainerPersonaFinderComponent';
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

    const handleCancelar=()=>{};

    return (
        <div className='container my-5 row justify-content-center'>
            <h1 className='text-center'>PERSONAS</h1>
            <Link to='/add-persona' className='btn btn-primary mb-2 col-lg-8' >Agregar Persona </Link>
            <div className='table-responsive col-lg-8 mt-2'>
                <ContainerDatoPersonaComponent personas={personas}/>
            </div>
            <div className='my-5'>
                <ContainerPersonaFinderComponent onCancelar={handleCancelar}></ContainerPersonaFinderComponent>
            </div>
        </div >
    )
}
export default ListPersonasComponent
