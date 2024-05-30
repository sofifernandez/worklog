import axios from "axios"

const PERSONA_ROL_BASE_REST_API_URL = "http://localhost:8080/personaRol"

class AssignRolService{

    getAllPersonaRoles(){
        return axios.get(PERSONA_ROL_BASE_REST_API_URL + 'es')
    }

    createPersonaRol(personaRol){
        return axios.post(PERSONA_ROL_BASE_REST_API_URL, personaRol)
    }

    getPersonaRolById(personaRolId){
        return axios.get(PERSONA_ROL_BASE_REST_API_URL +  '/' + personaRolId)
    }

    updatePersona(personaRolId, personaRol){
        return axios.put(PERSONA_ROL_BASE_REST_API_URL + '/' + personaRolId, personaRol)
    }

    deletePersona(personaRolId){
        return axios.delete((PERSONA_ROL_BASE_REST_API_URL +  '/' + personaRolId))
    }
}
// eslint-disable-next-line import/no-anonymous-default-export
export default new AssignRolService();