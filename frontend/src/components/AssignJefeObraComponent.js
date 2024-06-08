import React, { useEffect, useState } from 'react'
import PersonaRolService from '../services/PersonaRolService';
import PersonaService from '../services/PersonaService';
import { useNavigate, useParams } from 'react-router-dom';
import JefeObraService from '../services/JefeObraService';
import ObraService from '../services/ObraService';


export const AssignJefeObraComponent = () => {

    const [cedula, setCedula] = useState();
    const [personaRol, setPersonaRol] = useState();
    const [persona, setPersona] = useState();
    const [isJefeObra, setIsJefeObra] = useState(false)
    const [mensajeError, setMensajeError] = useState();
    const id = useParams()

    const navigate = useNavigate();

    const volver = (e) => {
        e.preventDefault();
        navigate('/');
    };


    const getInfoByCI = async (e) => {
        e.preventDefault();
        setPersonaRol()
        setPersona()
        setMensajeError()
        try {
            const personaRol = await getPersonaRol(cedula);
            if (personaRol) {
                if (personaRol.rol.rol === 'Jefe de obra') {
                    setIsJefeObra(true)
                } else {
                    setIsJefeObra(false)
                }
                setPersonaRol(personaRol);
                setPersona(personaRol.persona)
            } else {

            }

        } catch (error) {
            console.log('hola')
            setMensajeError(error.response.data)
        }
    };

    const asignarJefeObra = async (e) => {
        e.preventDefault()
        const obra = await ObraService.getObraById(id.id)
        console.log(obra.data)
        if (personaRol) {
            const nuevoJefeObra = { obra: obra.data, persona: persona }
            JefeObraService.createJefeObra(nuevoJefeObra).then((res) => {
                console.log(res)
                navigate('/obras')
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
            console.log(error)
            if (error.response && error.response.status === 404) {
                console.log('es 404')
                throw error;
            } else {
                throw error; // Re-throw other errors
            }
        }
    };

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
                {personaRol &&
                    (isJefeObra ? (
                        <div>
                            <div>{persona.nombre} {persona.apellido}</div>
                            <button className="btn btn-success py-2" type="submit" onClick={(e) => asignarJefeObra(e)}>Asignar</button>
                            <button className="btn btn-danger py-2" type="submit" onClick={(e) => volver(e)}>Cancelar</button>
                        </div>
                    ) : (
                        <div>{persona.nombre} {persona.apellido} no es Jefe de Obra</div>
                    ))
                }
                {mensajeError ? <div>{mensajeError}</div> : null}
            </div>
        </div>

    )
}
export default AssignJefeObraComponent