import axios from "axios"


const JORNALES_BASE_REST_API_URL = "http://localhost:8080/jornal"
//const JORNALES_BASE_REST_API_URL = "http://3.233.21.8:8080/jornal"

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

    updateJornal(jornalId, motivo, jornal){
        return axios.put(JORNALES_BASE_REST_API_URL + '/' + jornalId + '/' + motivo, jornal)
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

    validateDatos(persona, obra, fechaJornal, horaComienzoUnformatted, horaFinUnformatted, tipoJornal, confirmado, modificado){
          // Validate common fields before processing personas
          if (!fechaJornal) {
            throw new Error('La fecha no puede ser nula');
        }
        if (!horaComienzoUnformatted) {
            throw new Error('La hora de comienzo no puede ser nula');
        }
        if (!horaFinUnformatted) {
            throw new Error('La hora de fin no puede ser nula');
        }
        if (!obra) {
            throw new Error('Debes seleccionar una obra');
        }
        if (!persona) {
            throw new Error('Debes seleccionar al menos un trabajador');
        }
        const horaComienzoFormatted = fechaJornal + 'T' + horaComienzoUnformatted;
        const horaFinFormatted = fechaJornal + 'T' + horaFinUnformatted;
        const jornal = {
            persona, 
            obra, 
            fechaJornal, 
            horaComienzo: horaComienzoFormatted, 
            horaFin: horaFinFormatted, 
            modificado: false, 
            tipoJornal, 
            confirmado: true 
        };
        return axios.post(JORNALES_BASE_REST_API_URL + '/validateGeneral', jornal)
    }

}
// eslint-disable-next-line import/no-anonymous-default-export
export default new JornalService();