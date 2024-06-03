import axios from "axios"

const PERSONA_ROL_BASE_REST_API_URL = "http://localhost:8080/personaRol"

class PersonaRolService{

    getAllPersonaRoles(){
        return axios.get(PERSONA_ROL_BASE_REST_API_URL + 'es')
    }

    createPersonaRol(personaRol){
        return axios.post(PERSONA_ROL_BASE_REST_API_URL, personaRol)
    }

    getPersonaRolById(personaRolId){
        return axios.get(PERSONA_ROL_BASE_REST_API_URL +  '/' + personaRolId)
    }

    updatePersonaRol(personaRolId, personaRol){
        return axios.put(PERSONA_ROL_BASE_REST_API_URL + '/' + personaRolId, personaRol)
    }

    deletePersonaRol(personaRolId){
        return axios.delete((PERSONA_ROL_BASE_REST_API_URL +  '/' + personaRolId))
    }
    
    getPersonaRolActivoByCI(cedula){
        return axios.get(PERSONA_ROL_BASE_REST_API_URL + '/personaRolByCI/' + cedula)
    }
}
// eslint-disable-next-line import/no-anonymous-default-export
export default new PersonaRolService();