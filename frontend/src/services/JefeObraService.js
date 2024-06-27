import axios from "axios"

const JEFE_OBRA_BASE_REST_API_URL = "http://localhost:8080/"
//const LOGIN_BASE_REST_API_URL = "http://18.205.219.216:8080/login"

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
    
}

export default new JefeObraService();