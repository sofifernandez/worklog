import React, { useEffect, useState } from 'react';
import PersonaRolService from '../services/PersonaRolService';
import PersonaService from '../services/PersonaService';
import { useNavigate, useParams } from 'react-router-dom';
import ContainerBuscadorByCIComponent from './functionalComponents/ContainerBuscadorByCIComponent';
import DatoPersonaComponent from './functionalComponents/DatoPersonaComponent';

export const AssignRolComponent = () => {
    const [personaRol, setPersonaRol] = useState();
    const [persona, setPersona] = useState();
    const [rolSeleccionado, setRolSeleccionado] = useState();
    const [mensajeError, setMensajeError] = useState();

    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            getDatosById(id);
        }
    }, [id]);


    const cancelar = (e) => {
        e.preventDefault();
        id ? navigate('/personas') : setPersona(null);
    };

    const volver =()=>{
        navigate('/personas')
    }

    const handlePersonaFound = (persona) => {
        setPersona(persona);
        persona && setPersonaRol(persona.personaRol);
        persona?.personaRol && setRolSeleccionado(persona?.personaRol?.rol.id);
    };


    const seleccionarRol = (e) => {
        setRolSeleccionado(e.target.value);
    };


    const getDatosById = async (id) => {
        try {
            const personaData = await PersonaService.getPersonaById(id);
            setPersona(personaData.data);
            if (personaData.data) {
                getPersonaRolByCI(personaData.data.ci)
            }
        } catch (error) {
            setMensajeError(error.response?.data || 'An error occurred while fetching the data.');
        }
    };



    const guardarPersonaRol = (e) => {
        e.preventDefault();
        if (personaRol) {
            const nuevaPersonaRol = { ...personaRol, rol: { id: rolSeleccionado }, persona: persona };
            PersonaRolService.updatePersonaRol(personaRol.id, nuevaPersonaRol)
                .then(() => navigate('/personas'))
                .catch(e => setMensajeError(e.response.data));
        } else {
            const newPersonaRol = { rol: { id: rolSeleccionado }, persona: persona };
            PersonaRolService.createPersonaRol(newPersonaRol)
                .then((res) => {
                    setPersonaRol(res.data);
                    navigate('/personas');
                })
                .catch(e => setMensajeError(e.response));
        }
    };



    const getPersonaRolByCI = async (cedula) => {
        try {
            const result = await PersonaRolService.getPersonaRolActivoByCI(cedula);
            setPersonaRol(result.data)
            setRolSeleccionado(result.data.rol.id)
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setMensajeError(error.response.data)
            } else {
                throw error; // Re-throw other errors
            }
        }
    };


    return (
        <div className='mt-5 row justify-content-center col-12'>
            {!persona && (
                <div>
                    <ContainerBuscadorByCIComponent onPersonaFound={handlePersonaFound} onCancelar={volver}></ContainerBuscadorByCIComponent>
                </div>)}

            {persona && (
                <div className='row justify-content-center'>
                    <DatoPersonaComponent persona={persona}/>
                    <div className='col-12 col-lg-6 row justify-content-center'>
                        <h5 className='mt-5 px-0'>Selecciona un rol:</h5>
                        <div className="btn-group-vertical col-lg-9 mt-3" aria-label="Basic radio toggle button group">
                            <input type="radio" className="btn-check" name="btnradio" id="btnradio1" value="3" checked={rolSeleccionado === 3} onChange={(e) => seleccionarRol(e)} />
                            <label className="btn btn-outline-primary botonesRol" htmlFor="btnradio1">Trabajador</label>

                            <input type="radio" className="btn-check" name="btnradio" id="btnradio2" value="2" checked={rolSeleccionado === 2} onChange={(e) => seleccionarRol(e)} />
                            <label className="btn btn-outline-primary botonesRol" htmlFor="btnradio2">Jefe de obra</label>

                            <input type="radio" className="btn-check" name="btnradio" id="btnradio3" value="1" checked={rolSeleccionado === 1} onChange={(e) => seleccionarRol(e)} />
                            <label className="btn btn-outline-primary botonesRol" htmlFor="btnradio3">Administrador</label>
                        </div>

                        <button className="btn btn-success py-2 m-3 col-4" type="button" onClick={guardarPersonaRol}>Guardar</button>
                        <button className="btn btn-danger py-2 m-3 col-4" type="button" onClick={cancelar}>Cancelar</button>
                    </div>
                </div>
            )}
            {mensajeError && <div className='alert alert-light' role='alert'>{mensajeError}</div>}
        </div>
    );
};

export default AssignRolComponent;