import axios from "axios"


const JORNALES_BASE_REST_API_URL = "http://localhost:8080/jornal"
//const JORNALES_BASE_REST_API_URL = "http://18.205.219.216:8080/jornal"

//initAxiosInterceptors();


class JornalService{

    getAllJornales(){
        return axios.get(JORNALES_BASE_REST_API_URL + 'es')
    }

    createJornal(jornal){
        return axios.post(JORNALES_BASE_REST_API_URL, jornal)
    }

    createOrUpdateJornalQr(jornal){
        return axios.post(JORNALES_BASE_REST_API_URL + "Qr", jornal)
    }

    getJornalById(jornalId){
        return axios.get(JORNALES_BASE_REST_API_URL +  '/' + jornalId)
    }

    updateJornal(jornalId, jornal){
        return axios.put(JORNALES_BASE_REST_API_URL + '/' + jornalId, jornal)
    }

    deleteJornal(jornalId){
        return axios.delete((JORNALES_BASE_REST_API_URL +  '/' + jornalId))
    }
    
    getJornalesByPersonaId(personaId){
        return axios.get(JORNALES_BASE_REST_API_URL + '/jornalByPersona/' + personaId)
    }

    getJornalesByFiltros(fechaDesde, fechaHasta, obraSeleccionada, personaId){
        return axios.get(`${JORNALES_BASE_REST_API_URL}/jornalByFiltros/`, {
            params: {
                fechaDesde: fechaDesde,
                fechaHasta: fechaHasta,
                obraSeleccionada: obraSeleccionada,
                personaId:personaId
            }
        });
    }

    agregarLluvia(jornal){
        return axios.post(JORNALES_BASE_REST_API_URL + '/agregarLluvia', jornal);
    }

}
// eslint-disable-next-line import/no-anonymous-default-export
export default new JornalService();