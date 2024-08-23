import React, { useEffect, useState } from 'react'
import PersonaRolService from '../services/PersonaRolService';
import { useNavigate, useParams } from 'react-router-dom';
import JefeObraService from '../services/JefeObraService';
import ObraService from '../services/ObraService';
import ContainerBuscadorByCIComponent from './functionalComponents/ContainerBuscadorByCIComponent';
import DatoPersonaComponent from './functionalComponents/DatoPersonaComponent';


export const AssignJefeObraComponent = () => {
    const [persona, setPersona] = useState();
    const [isJefeObra, setIsJefeObra] = useState(false)
    const [mensajeError, setMensajeError] = useState();
    const [personaRol, setPersonaRol] = useState()
    const [obra, setObra] =useState();
    const { id } = useParams()

    const navigate = useNavigate();

    const volver = (e) => {
        if(!persona) {
            navigate('/obras');
        }
        if(isJefeObra===false) {
            setPersona()
        }
        else {
            navigate('/obras');
        }

    };

    const handlePersonaFound = (persona) => {
        setPersona(persona);
        persona && setPersonaRol(persona.personaRol);
    };


    const cancelar = (e) => {
        e.preventDefault();
         setPersona(null);
         setPersonaRol(null)
    };

    useEffect(() => {
        if (id) {
            getObraById(id);
        }
    }, [id]);


    const getObraById = async (id) => {
        try {
            const obraData = await ObraService.getObraById(id);
            setObra(obraData.data);
        } catch (error) {
            setMensajeError(error.response?.data || 'An error occurred while fetching the data.');
        }
    };

    useEffect(() => {
        const fetchEsJefe = async () => {
            if (persona) {
                try {
                    const esJefeData = await PersonaRolService.getEsJefeObraByPersonaId(persona.id);
                    setIsJefeObra(esJefeData.data);
                } catch (error) {
                    setIsJefeObra(false)
                    setMensajeError(error.response?.data || 'Ocurrió un error');
                }
            }
        };
        fetchEsJefe();
    }, [persona]);
   

    const asignarJefeObra = async (e) => {
        if (isJefeObra) {
            const nuevoJefeObra = { obra: obra, persona: persona }
            JefeObraService.createJefeObra(nuevoJefeObra).then((res) => {
                navigate('/obras')
            }).catch(e => {
                setMensajeError(e.response?.data || 'Ocurrió un error');
            })
        }

    }

    return (
        <div className='mt-5 row justify-content-center col-12'>
            {obra && (
                <><h3>Asignar jefe de obra a: </h3><p>{obra.nombre} (BPS: {obra.bps}) </p></>
            )}
            {!persona && (<div className='row justify-content-center'>
                <ContainerBuscadorByCIComponent onPersonaFound={handlePersonaFound} minimalData={true} onCancelar={volver} handleRowClick={asignarJefeObra}></ContainerBuscadorByCIComponent>
            </div>)}
            { persona && (
                <div className='col-12 col-lg-7 row justify-content-center'>
                    <h5 className='px-0'>Resultado:</h5>
                    <DatoPersonaComponent persona={persona} personaRol={personaRol ? personaRol.rol.rol : 'Sin rol'} />
                    {isJefeObra===true && (<><button className="btn btn-success py-2 m-3 col-4" type="submit" onClick={(e) => asignarJefeObra(e)}>Asignar</button><button className="btn btn-danger py-2 m-3 col-4" type="submit" onClick={cancelar}>Cancelar</button></>)}
                </div>
            )}

            {isJefeObra===false && persona && (
                <div className='col-12 col-lg-7 row justify-content-center'>
                    <div className='alert alert-light' role='alert'>La persona encotrada no tiene autorización para ser jefe de obra</div>
                    <button className="btn btn-danger py-2 m-3 col-4" type="submit" onClick={volver}>Volver</button>
                </div>
            )}  
            {mensajeError && <div className='alert alert-light' role='alert'>{mensajeError}</div>}     
        </div>

    )
}
export default AssignJefeObraComponent