import React, { useEffect, useState } from 'react'
import PersonaService from '../services/PersonaService';
import AssignRolService from '../services/AssignRolService';


export const AssignRolComponent = () => {

    const [cedula, setCedula] = useState();
    const [personaRol, setPersonaRol] = useState();


    const buscarPersona = (e) => {
        e.preventDefault()
        PersonaService.getPersonaRolActivoByCI(cedula)
            .then((result) => {
                setPersonaRol(result);
                console.log(result); // Log the result after it has been set
            })
            .catch((error) => {
                console.error("Error fetching persona role:", error);
            });
    };

    return(
        <div>
            <form>
                <img className="mb-4" src="../assets/brand/bootstrap-logo.svg" alt="" width="72" height="57" />
                <h1 className="h3 mb-3 fw-normal">Buscar usuario</h1>
                <div className="form-floating">
                    <input type="text" className="form-control" id="floatingInput" placeholder="Ejemplo: 12345678" onChange={(e) => setCedula(e.target.value)} />
                    <label for="floatingInput">Cédula</label>
                </div>
                <button className="btn btn-primary w-100 py-2" type="submit" onClick={(e) => buscarPersona(e)}>Buscar</button>
            </form>
            <div>
                {personaRol!==undefined ? 
                <div>{personaRol.id} 
                    <div class="list-group">
                        <label class="list-group-item d-flex gap-2">
                            <input class="form-check-input flex-shrink-0" type="radio" name="listGroupRadios" id="listGroupRadios1" value="3" checked={personaRol.id == 3} />
                            <span>
                                Trabajador
                                <small class="d-block text-body-secondary">With support text underneath to add more detail</small>
                            </span>
                        </label>
                        <label class="list-group-item d-flex gap-2">
                            <input class="form-check-input flex-shrink-0" type="radio" name="listGroupRadios" id="listGroupRadios2" value="2" checked={personaRol.id == 2} />
                            <span>
                                Jefe de obra
                                <small class="d-block text-body-secondary">Some other text goes here</small>
                            </span>
                        </label>
                        <label class="list-group-item d-flex gap-2">
                            <input class="form-check-input flex-shrink-0" type="radio" name="listGroupRadios" id="listGroupRadios3" value="1" checked={personaRol.id == 1} />
                            <span>
                                Administrador
                                <small class="d-block text-body-secondary">And we end with another snippet of text</small>
                            </span>
                        </label>
                    </div>
                </div>: null}
            </div>
        </div>

    )
}
export default AssignRolComponent;
