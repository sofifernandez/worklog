import axios from "axios"

const BASE_REST_API_URL = "http://backend-worklog.rustikas.com.uy:8080/"


class ReporteService {

    getReporteEntreFechas(exportRequest) {
        return axios.post(BASE_REST_API_URL + 'reporte', exportRequest,{
            responseType: 'blob', // Ensure the response is handled as a binary blob
        })
    }

}
// eslint-disable-next-line import/no-anonymous-default-export
export default new ReporteService()