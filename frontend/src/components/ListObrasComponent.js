import React, { useState, useEffect } from 'react'
import ObraService from '../services/ObraService'
import { Link } from 'react-router-dom'
import ContainerDatoObraComponent from './functionalComponents/ContainerDatoObraComponent';
import  ContainerBuscadorByBPSComponent from './functionalComponents/ContainerBuscadorByBPSComponent'

const ListObrasComponent = () => {

    const [obras, setObras] = useState([])
    

    const listarObras = () => {
        ObraService.getAllObras().then(res => {
            setObras(res.data)

        }).catch(error => {
            console.log(error)
        })
    }

    useEffect(() => {
        listarObras()
    }, [])

    const onRefrescarDatos =()=>{
        listarObras()
    }

    const handleObraFound=()=>{}
    const handleCancelar=()=>{}


    return (
        <div className='container mt-5 row justify-content-center'>
            <h2 className='text-center'>Lista de obras</h2>
            <Link to='/add-obra' className='btn btn-primary mb-2 col-lg-9' >Agregar nueva obra </Link>
            <div className='table-responsive col-lg-9'>
                <ContainerDatoObraComponent obras={obras} onRefrescarDatos={onRefrescarDatos}></ContainerDatoObraComponent>
            </div>
            <div className='mt-5'>
                <ContainerBuscadorByBPSComponent onObraFound={handleObraFound} onCancelar={handleCancelar}/>
            </div>
        </div >
    )
}

export default ListObrasComponent   