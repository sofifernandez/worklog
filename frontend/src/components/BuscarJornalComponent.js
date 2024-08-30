import React, { useState } from 'react'
import ContainerDatoJornalComponent from './functionalComponents/ContainerDatoJornalComponent';
import JornalFinderFormComponent from "./functionalComponents/JornalFinderFormComponent";
import { useNavigate } from 'react-router-dom';
import JornalService from '../services/JornalService';
import ObraService from "../services/ObraService";
import JefeObraService from '../services/JefeObraService';
import { useAuth } from '../context/AuthContext';

const BuscarJornalComponent = ({ showTrabajadores, adminView, jefeView, workerView }) => {
    const [obras, setObras] = useState([]);
    const [jornales, setJornales] =useState();
    const [mensajeError, setMensajeError] = useState();
    const { personaRolLoggeado } = useAuth();
    const navigate = useNavigate();

    const fetchObrasActivasEntreFechas = async (fechaDesde, fechaHasta) => {
        try {
            if (adminView) {
                const obrasData = await ObraService.getObrasActivasEntreFechas(fechaDesde, fechaHasta);
                setObras(obrasData.data);
            }
            if(workerView) {
                const obrasData = await ObraService.getObrasActivasEntreFechasyTrabajador(fechaDesde, fechaHasta, personaRolLoggeado.id);
                setObras(obrasData.data);
            } 
            if(jefeView) {
                const obrasData = await JefeObraService.getObraByJefeId(personaRolLoggeado.id);
                setObras([obrasData.data]);
            }
        } catch (error) {
            const errorMessage = error.response?.data || 'An error occurred';
            setMensajeError(errorMessage);
        }
    };

    const getJornalesPorFiltros = async (data) => {
        setMensajeError();
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
        setJornales(null)
        setObras([])
        navigate('/buscar-jornal');
    }

    const handleCancelar = () => {
        navigate('/');
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
                onCancelar={handleCancelar}
                />
            )}
            {jornales?.length > 0 &&
                (<div className=' row justify-content-center col-lg-9 mt-4'>
                <h2>Resultados:</h2>
                    <div className='table-responsive mt-2 mx-auto'>
                        <ContainerDatoJornalComponent jornales={jornales.slice(0, 10)} adminView={adminView} jefeView={jefeView} confirmar={true} />
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









