import axios from "axios"
import { initAxiosInterceptors } from "../helpers/AuthHelper"

const BASE_REST_API_URL = "http://localhost:8080/"
//const OBRA_BASE_REST_API_URL = "http://18.205.219.216:8080/"

//initAxiosInterceptors();

class ReporteService {

    getReporteEntreFechas(exportRequest) {
        return axios.post(BASE_REST_API_URL + 'reporte', exportRequest,{
            responseType: 'blob', // Ensure the response is handled as a binary blob
        })
    }

}
// eslint-disable-next-line import/no-anonymous-default-export
export default new ReporteService()