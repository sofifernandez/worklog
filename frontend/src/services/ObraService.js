import axios from "axios"

const OBRA_BASE_REST_API_URL = "http://backend-worklog.rustikas.com.uy:8080"

class ObraService {

    getAllObras() {
        return axios.get(OBRA_BASE_REST_API_URL + '/obras')
    }

    createObra(obra) {
        return axios.post(OBRA_BASE_REST_API_URL + '/obra', obra)
    }

    getObraById(obraId) {
        return axios.get(OBRA_BASE_REST_API_URL + '/obra/' + obraId)
    }

    updateObra(obraId, obra) {
        return axios.put(OBRA_BASE_REST_API_URL + '/obra/' + obraId, obra)
    }

    deleteObra(obraId) {
        return axios.delete((OBRA_BASE_REST_API_URL + '/obra/' + obraId))
    }

    getObraByBPS(bps) {
        return axios.get(OBRA_BASE_REST_API_URL + '/getObraByBPS/' + bps)
    }

    getObrasActivasEntreFechas(fechaDesde, fechaHasta) {
        return axios.get(`${OBRA_BASE_REST_API_URL}/getAllObrasByDates/`, {
            params: {
                fechaDesde: fechaDesde,
                fechaHasta: fechaHasta
            }
        });
    }
    
    getObraByNombre(nombre){
        return axios.get(OBRA_BASE_REST_API_URL + '/getObraByNombre/' + nombre)
    }

    getObrasActivasEntreFechasyTrabajador(fechaDesde, fechaHasta, persona_id){
        return axios.get(`${OBRA_BASE_REST_API_URL}/getAllObrasByDatesAndTrabajador/`, {
            params: {
                fechaDesde: fechaDesde,
                fechaHasta: fechaHasta,
                persona_id: persona_id
            }
        });
    }

}
// eslint-disable-next-line import/no-anonymous-default-export
export default new ObraService()