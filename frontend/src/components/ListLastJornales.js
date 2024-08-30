import { Link } from 'react-router-dom'
import ContainerDatoJornalComponent from './functionalComponents/ContainerDatoJornalComponent';
import React, { useEffect, useState } from 'react'

import JornalService from '../services/JornalService';
import { useAuth } from '../context/AuthContext';


export const ListLastJornalesComponent = () => {
    const { personaRolLoggeado, refreshJornales } = useAuth();
    const [jornales, setJornales] = useState([])
    const [isAdmin, setIsAdmin]=useState(false)


    const listarJornales = () => {
        if (personaRolLoggeado.personaRol.rol.rol === "ADMINISTRADOR") {
            setIsAdmin(true)
            JornalService.getLastJornales().then(res => {
                setJornales(res.data)
            }).catch(error => {
                console.log(error)
            })
        } else {
            JornalService.getJornalesByPersonaId(personaRolLoggeado.id).then(res => {
                setJornales(res.data)
            }).catch(error => {
                console.log(error)
            })
        }
            
    }

    useEffect(() => {
        listarJornales()
    }, [refreshJornales])

    return (
        <div className="container mt-5 row justify-content-center">
            <h2 className='text-center mt-5'>Últimos registros</h2>
            {jornales.length > 0 ?
                <div className='table-responsive mt-2'>
                    <ContainerDatoJornalComponent adminView={isAdmin} jornales={jornales.slice(0, 30)} />
                </div>
                :
                <div className='text-center'>Sin datos</div>
            }

            {personaRolLoggeado.personaRol.rol.rol === "JEFE_OBRA" && (
                <Link to='/buscar-my-jornal' className='btn btn-secondary col-md-6'>Buscar</Link>
            )}

            {personaRolLoggeado.personaRol.rol.rol === "TRABAJADOR" && (
                <Link to='/buscar-jornal' className='btn btn-secondary col-md-6'>Buscar</Link>
            )}

        </div>
    )
}

export default ListLastJornalesComponent;