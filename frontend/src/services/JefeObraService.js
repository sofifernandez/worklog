import axios from "axios"

const JEFE_OBRA_BASE_REST_API_URL = "http://backend-worklog.rustikas.com.uy:8080/"

class JefeObraService{

    getAllJefeObra(){
        return axios.get(JEFE_OBRA_BASE_REST_API_URL + 'jefeObras')
    }

    createJefeObra(jefeObra){
        return axios.post(JEFE_OBRA_BASE_REST_API_URL + 'jefeObra', jefeObra)
    }

    getJefeObraById(jefeObraId){
        return axios.get(JEFE_OBRA_BASE_REST_API_URL +  'jefeObra/' + jefeObraId)
    }

    updateJefeObra(jefeObraId, jefeObra){
        return axios.put(JEFE_OBRA_BASE_REST_API_URL + 'jefeObra/' + jefeObraId, jefeObra)
    }

    deleteJefeObra(jefeObraId){
        return axios.delete(JEFE_OBRA_BASE_REST_API_URL +  'jefeObra/' + jefeObraId)
    }
    
    getObraByJefeId(id){
        return axios.get(JEFE_OBRA_BASE_REST_API_URL +  'getObraByJefe/' + id)
    }
}

export default new JefeObraService();