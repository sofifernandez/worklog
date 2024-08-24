import React, { useState, useEffect } from 'react'
import ContainerDatoJornalComponent from './functionalComponents/ContainerDatoJornalComponent';
import JornalFinderFormComponent from "./functionalComponents/JornalFinderFormComponent";
import { useNavigate } from 'react-router-dom';
import JornalService from '../services/JornalService';
import ObraService from "../services/ObraService";
import { useAuth } from '../context/AuthContext';

const BuscarJornalComponent = ({ showTrabajadores, adminView }) => {
    const [obras, setObras] = useState([]);
    const [jornales, setJornales] =useState();
    const [mensajeError, setMensajeError] = useState();
    const { personaRolLoggeado } = useAuth();
    const navigate = useNavigate();

    const fetchObrasActivasEntreFechas = async (fechaDesde, fechaHasta) => {
        try {
            const obrasData = showTrabajadores 
                ? await ObraService.getObrasActivasEntreFechas(fechaDesde, fechaHasta) 
                : await ObraService.getObrasActivasEntreFechasyTrabajador(fechaDesde, fechaHasta, personaRolLoggeado.id);
            setObras(obrasData.data);
        } catch (error) {
            const errorMessage = error.response?.data || 'An error occurred';
            setMensajeError(errorMessage);
        }
    };

    const getJornalesPorFiltros = async (data) => {
        try {

            if(!showTrabajadores) data= {...data, personas:[personaRolLoggeado.id]}
            const result = await JornalService.getJornalesByFiltrosWithDTO(data);
           setJornales(result.data)
        } catch (error) {
            if (error.response) {
                setMensajeError(error.response.data);
            } else {
                setMensajeError('Ocurrió un error');
            }
        }
    }
   

    const handleVolver = () => {
        setMensajeError(null)
        navigate('/buscar-jornalPrueba');
    }

    const handleCancelar = () => {
        setMensajeError(null)
        navigate('/buscar-jornalPrueba');
    }


    return (
        <div className='d-flex justify-content-center align-items-center mt-3 row'>
            {!jornales && 
            (
                <JornalFinderFormComponent
                titleFromParent={'Buscar jornales'}
                obrasFromParent={obras}
                showTrabajadores={showTrabajadores}
                onSubmitDataToParent={getJornalesPorFiltros} 
                onFechasChange={fetchObrasActivasEntreFechas}
                />
            )}
            {jornales?.length > 0 &&
                (<div className=' row justify-content-center col-lg-9 mt-2'>
                    <div className='table-responsive mt-2 mx-auto'>
                        <ContainerDatoJornalComponent jornales={jornales.slice(0, 10)} adminView={adminView} />
                    </div>
                    <div>
                        <div className='btn btn-secondary col-12 col-lg-2 mx-auto' onClick={handleVolver}>Volver</div>
                    </div>
                </div>
                )
            }
            {jornales?.length === 0 && (
                <><div>No hay resultados</div><div className='btn btn-secondary' onClick={handleVolver}>Volver</div></>
            )}
            {mensajeError && <div className='alert alert-danger mt-3 col-6' role='alert'>{mensajeError}</div>}
        </div>
    );
};

export default BuscarJornalComponent;









