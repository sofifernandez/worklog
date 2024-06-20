import axios from "axios"
import { initAxiosInterceptors } from "../helpers/AuthHelper"

const OBRA_BASE_REST_API_URL = "http://localhost:8080/"
//const OBRA_BASE_REST_API_URL = "http://18.205.219.216:8080/"

//initAxiosInterceptors();

class ObraService{

    getAllObras(){
        return axios.get(OBRA_BASE_REST_API_URL + 'obras')
    }

    createObra(obra){
        return axios.post(OBRA_BASE_REST_API_URL + 'obra', obra)
    }

    getObraById(obraId){
        return axios.get(OBRA_BASE_REST_API_URL +  'obra/' + obraId)
    }

    updateObra(obraId, obra){
        return axios.put(OBRA_BASE_REST_API_URL + 'obra/' + obraId, obra)
    }

    deleteObra(obraId){
        return axios.delete((OBRA_BASE_REST_API_URL +  'obra/' + obraId))
    }

    getObraByBPS(bps){
        return axios.get(OBRA_BASE_REST_API_URL +  'getObraByBPS/' + bps)
    }
}
// eslint-disable-next-line import/no-anonymous-default-export
export default new ObraService()