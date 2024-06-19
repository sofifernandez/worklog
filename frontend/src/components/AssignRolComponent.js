import React, { useEffect, useState } from 'react';
import PersonaRolService from '../services/PersonaRolService';
import PersonaService from '../services/PersonaService';
import { useNavigate, useParams } from 'react-router-dom';
import BuscadorByCedulaComponent from './functionalComponents/BuscadorByCIComponent'

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


   /*  useEffect(() => {
        setPersonaRol(null);
        setRolSeleccionado(null);
        setMensajeError(null)
        const fetchPersonaRol = async () => {
            if (persona) {
                try {
                    const personaRolData = await getPersonaRolByCI(persona.ci);
                    if (personaRolData) {
                        setPersonaRol(personaRolData);
                        setRolSeleccionado(personaRolData.rol.id);
                    }
                } catch (error) {
                    setMensajeError(error.response?.data || 'Ocurrió un error');
                }
            }
        };
        fetchPersonaRol();
    }, [persona]); */

    const volver = (e) => {
        e.preventDefault();
        navigate('/personas');
    };

    const cancelar = (e) => {
        e.preventDefault();
        id ? navigate('/personas') : setPersona(null);
    };

    const handlePersonaFound = (persona) => {
        setPersona(persona);
    };

    const handlePersonaRolFound=(personaRol) =>{
        setPersonaRol(personaRol);
        personaRol && setRolSeleccionado(personaRol.rol.id)
    }

    const handleMensajeRolNotFound = (mensaje) =>{
        setMensajeError(mensaje)
    }

    const seleccionarRol = (e) => {
        
        setRolSeleccionado(e.target.value);
    };


    const getDatosById = async (id) => {
        try {
            const personaData = await PersonaService.getPersonaById(id);
            setPersona(personaData.data);
            if(personaData.data){
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
            {persona ? (
                <div className='col-12 col-lg-6 row justify-content-center'>
                    <h5 className='px-0'>Resultado:</h5>
                    <table className='table table-sm table-bordered table-striped mt-3'>
                        <thead>
                            <th>Nombre completo</th>
                            <th>Cédula</th>
                            <th>Fecha Nacimiento</th>
                            <th>Rol actual</th>
                        </thead>
                        <tbody>
                            <tr key={persona.id}>
                                <td >{persona.nombre} {persona.apellido}</td>
                                <td >{persona.ci}</td>
                                <td>{persona.fechaNacimiento}</td>
                                <td>{personaRol ? personaRol.rol.rol : 'Sin rol'}</td>
                            </tr>
                        </tbody>
                    </table>
                    {mensajeError && <div className='alert alert-light' role='alert'>{mensajeError}</div>}
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
            ) : (
                <div className='col-12 col-lg-6 row justify-content-center'>
                    <BuscadorByCedulaComponent onPersonaFound={handlePersonaFound} onPersonaRolFound={handlePersonaRolFound} onVolver={volver} onMensajeErrorPersonaRolNotFound={handleMensajeRolNotFound}  />
                </div>
            )}
        </div>
    );
};

export default AssignRolComponent;