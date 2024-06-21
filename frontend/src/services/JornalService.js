import axios from "axios"
import { initAxiosInterceptors } from "../helpers/AuthHelper"

const JORNAL_BASE_REST_API_URL = "http://localhost:8080/"
//const JORNAL_BASE_REST_API_URL = "http://18.205.219.216:8080/"

//initAxiosInterceptors();

class JornalService{

    getAllJornales(){
        return axios.get(JORNAL_BASE_REST_API_URL + 'jornales')
    }

    createJornal(jornal){
        return axios.post(JORNAL_BASE_REST_API_URL + 'jornal', jornal)
    }

    getJornalById(jornalId){
        return axios.get(JORNAL_BASE_REST_API_URL +  'jornal/' + jornalId)
    }

    updateJornal(jornalId, jornal){
        return axios.put(JORNAL_BASE_REST_API_URL + 'jornal/' + jornalId, jornal)
    }

    deleteJornal(jornalId){
        return axios.delete(JORNAL_BASE_REST_API_URL +  'jornal/' + jornalId)
    }
}
export default new JornalService