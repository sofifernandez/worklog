import React, { useEffect, useState } from 'react'
import PersonaRolService from '../services/PersonaRolService';
import PersonaService from '../services/PersonaService';
import { useNavigate } from 'react-router-dom';


export const AssignRolComponent = () => {

    const [cedula, setCedula] = useState();
    const [personaRol, setPersonaRol] = useState();
    const [persona, setPersona]=useState();
    const [rolSeleccionado, setRolSeleccionado] = useState();
    const [mensajeError, setMensajeError]=useState();

    const navigate = useNavigate();

    const volver = (e) => {
        e.preventDefault();
        navigate('/'); // replace '/target-page' with the desired path
      };


    const getInfoByCI = async(e) => {
        e.preventDefault();
        setPersonaRol()
        setPersona()
        setMensajeError()
        setRolSeleccionado()
        try {
            const personaRol = await getPersonaRol(cedula);
            if (personaRol) {
                setPersonaRol(personaRol);
                setRolSeleccionado(personaRol.rol.id)
                setPersona(personaRol.persona)
            } else {
                const persona = await getPersona(cedula);
                setPersona(persona);
            }
        } catch (error) {
            setMensajeError(error.response.data)
        }
    };

    const seleccionarRol = (e) => {
        e.preventDefault();
        setRolSeleccionado(e.target.value);
    }

    const guardarPersonaRol=(e)=>{
        e.preventDefault();
        if(personaRol){
            const nuevaPersonaRol ={...personaRol,rol:{id:rolSeleccionado}, persona:persona}
            PersonaRolService.updatePersonaRol(personaRol.id, nuevaPersonaRol)
        } else {
            const updatedPersonaRol={rol:{id:rolSeleccionado}, persona:persona}
            PersonaRolService.createPersonaRol(updatedPersonaRol).then((res) => {
                setPersonaRol(res.data)
                navigate('/personas')
            }).catch(e => {
                console.log(e)
            })
        }
    }

    const getPersonaRol = async (cedula) => {
        try {
            const result = await PersonaRolService.getPersonaRolActivoByCI(cedula);
            return result.data;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                return null; // Indicate that PersonaRol was not found
            } else {
                throw error; // Re-throw other errors
            }
        }
    };
    
    const getPersona = async (cedula) => {
        try {
            const result = await PersonaService.getPersonaByCI(cedula);
            return result.data;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.log('es 404')
                throw error; // Re-throw other errors

            }
        };
    }

    return (
        <div className='col-8'>
            <form>
                <h1 className="h3 mb-3 fw-normal">Buscar usuario</h1>
                <div className="form-floating">
                    <input type="text" className="form-control" id="floatingInput" placeholder="Ejemplo: 12345678" onChange={(e) => setCedula(e.target.value)} />
                    <label htmlFor="floatingInput">Cédula</label>
                </div>
                <button className="btn btn-primary py-2" type="submit" onClick={(e) => getInfoByCI(e)}>Buscar</button>
            </form>
            <div>
                {persona !== undefined ? 
                    <div>{persona.nombre} {persona.apellido}
                        <div className="list-group">
                            <label className="list-group-item d-flex gap-2">
                                <input className="form-check-input flex-shrink-0" type="radio" name="listGroupRadios" id="listGroupRadios1" value="3" checked={rolSeleccionado == 3} onChange={(e) => seleccionarRol(e)} />
                                <span>
                                    Trabajador
                                    <small className="d-block text-body-secondary">With support text underneath to add more detail</small>
                                </span>
                            </label>
                            <label className="list-group-item d-flex gap-2">
                                <input className="form-check-input flex-shrink-0" type="radio" name="listGroupRadios" id="listGroupRadios2" value="2" checked={rolSeleccionado == 2} onChange={(e) => seleccionarRol(e)} />
                                <span>
                                    Jefe de obra
                                    <small className="d-block text-body-secondary">Some other text goes here</small>
                                </span>
                            </label>
                            <label className="list-group-item d-flex gap-2">
                                <input className="form-check-input flex-shrink-0" type="radio" name="listGroupRadios" id="listGroupRadios3" value="1" checked={rolSeleccionado == 1} onChange={(e) => seleccionarRol(e)} />
                                <span>
                                    Administrador
                                    <small className="d-block text-body-secondary">And we end with another snippet of text</small>
                                </span>
                            </label>
                        </div>
                        <button className="btn btn-success py-2" type="submit" onClick={(e) => guardarPersonaRol(e)}>Guardar</button>
                        <button className="btn btn-danger py-2" type="submit" onClick={(e) => volver(e)}>Cancelar</button>
                </div> : null}
                {mensajeError ? <div>{mensajeError}</div> : null}
            </div>
        </div>

    )
}
export default AssignRolComponent;
