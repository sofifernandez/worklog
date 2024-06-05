import axios from "axios"

const BASE_REST_API_URL = "http://localhost:8080/"
//const BASE_REST_API_URL = "http://18.205.219.216:8080/"

// Create an instance of Axios
const axiosInstance = axios.create({
    baseURL: BASE_REST_API_URL
});

// Add a response interceptor
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 404) {
      // Suppress the console error for 404
      console.log('Resource not found (404)');
    }
    return Promise.reject(error);
  }
);


class PersonaService{

    getAllPersonas(){
        return axiosInstance.get(BASE_REST_API_URL + 'personas')
    }

    createPersona(persona){
        return axiosInstance.post(BASE_REST_API_URL + 'persona', persona)
    }

    getPersonaById(personaId){
        return axiosInstance.get(BASE_REST_API_URL +  'persona/' + personaId)
    }

    updatePersona(personaId, persona){
        return axiosInstance.put(BASE_REST_API_URL + 'persona/' + personaId, persona)
    }

    deletePersona(personaId){
        return axiosInstance.delete((BASE_REST_API_URL +  'persona/' + personaId))
    }

    getPersonaByCI(cedula){
        return axiosInstance.get(BASE_REST_API_URL + 'persona/searchByCI/' + cedula)
    }

}
export default new PersonaService