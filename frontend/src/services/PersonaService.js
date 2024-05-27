import axios from "axios"

const PERSONA_BASE_REST_API_URL = "http://localhost:8080/"

class PersonaService{

    getAllPersonas(){
        return axios.get(PERSONA_BASE_REST_API_URL + 'personas')
    }

    createPersona(persona){
        return axios.post(PERSONA_BASE_REST_API_URL + 'persona', persona)
    }

    getPersonaById(personaId){
        return axios.get(PERSONA_BASE_REST_API_URL +  'persona/' + personaId)
    }

    updatePersona(personaId, persona){
        return axios.put(PERSONA_BASE_REST_API_URL + 'persona/' + personaId, persona)
    }

    deletePersona(personaId){
        return axios.delete((PERSONA_BASE_REST_API_URL +  'persona/' + personaId))
    }
}
export default new PersonaService