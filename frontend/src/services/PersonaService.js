import axios from "axios"
import { initAxiosInterceptors } from "../helpers/AuthHelper";

const BASE_REST_API_URL = "http://localhost:8080/"
//const BASE_REST_API_URL = "http://3.233.21.8:8080/"

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

axiosInstance.interceptors.request.use(function(request){
    const token = window.localStorage.getItem('appJornalesToken');
    if (token) {
        request.headers['Authorization'] = `Bearer ${token}`;
    } else {
        request.headers['Authorization'] = null;
    }
    return request;
  }
);

class PersonaService{

    // BASIC CRUD

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

    // CURSTOM

    getPersonaByCI(cedula){
        return axiosInstance.get(BASE_REST_API_URL + 'persona/findByCI/' + cedula)
    }

    getPersonaByUsername(username){
        return axiosInstance.get(BASE_REST_API_URL + 'persona/findByUsername/' + username)
    }

    getAllTrabajadoresActivos(){
        return axiosInstance.get(BASE_REST_API_URL + 'persona/getAllTrabajadoresActivos')
    }

    getAllTrabajadoresDeObra(obraId){
        return axiosInstance.get(BASE_REST_API_URL + 'persona/getAllTrabajadoresDeObra/' + obraId)
    }

    getTrabajadoresDeObraPorFecha(obraId, fecha){
        return axios.get(`${BASE_REST_API_URL}persona/getTrabajadoresDeObraPorFecha/`, {
            params: {
                obraId: obraId,
                fecha: fecha,
            }
        });
    }

    getPersonasByNombre(nombre){
        return axios.get(BASE_REST_API_URL + 'persona/getPersonasByNombre/' + nombre);
    }

    getPersonaByCIoNombre(parametro){
        if (parametro.length > 0 && !isNaN(parseInt(parametro.charAt(0)))) {
            return this.getPersonaByCI(parametro)
        } 
        return this.getPersonasByNombre(parametro)
    }

}
export default new PersonaService