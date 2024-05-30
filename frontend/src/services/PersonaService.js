import axios from "axios"

const BASE_REST_API_URL = "http://localhost:8080/"

class PersonaService{

    getAllPersonas(){
        return axios.get(BASE_REST_API_URL + 'personas')
    }

    createPersona(persona){
        return axios.post(BASE_REST_API_URL + 'persona', persona)
    }

    getPersonaById(personaId){
        return axios.get(BASE_REST_API_URL +  'persona/' + personaId)
    }

    updatePersona(personaId, persona){
        return axios.put(BASE_REST_API_URL + 'persona/' + personaId, persona)
    }

    deletePersona(personaId){
        return axios.delete((BASE_REST_API_URL +  'persona/' + personaId))
    }

    getPersonaByCI(cedula){
        return axios.get(BASE_REST_API_URL + 'persona/searchByCI/', cedula)
    }

    getPersonaRolActivoByCI(cedula){
        return axios.get(BASE_REST_API_URL + 'personaRol/personaRolByCI/', cedula)
    }
}
export default new PersonaService