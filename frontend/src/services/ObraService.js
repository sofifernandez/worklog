import axios from "axios"

const OBRA_BASE_REST_API_URL = "http://localhost:8080/"

class ObraSerice{

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
}
export default new ObraSerice