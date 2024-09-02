import axios from "axios"

const LOGIN_BASE_REST_API_URL = "http://backend-worklog.rustikas.com.uy:8080/usuario"

class UsuarioService{

    isResetPassword(personaId){
        return axios.get(LOGIN_BASE_REST_API_URL + '/reset-password/' +personaId)
    }

    updatePassword(personaId, newPassword){
        return axios.put(`${LOGIN_BASE_REST_API_URL}/new-password`, {
            personaId: personaId,
            newPassword: newPassword
        });
    }
}
export default new UsuarioService       