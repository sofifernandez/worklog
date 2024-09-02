import axios from "axios"

const LOGIN_BASE_REST_API_URL = "http://backend-worklog.rustikas.com.uy:8080/login"

class LoginService{

    iniciarSesion(credenciales){
        return axios.post(LOGIN_BASE_REST_API_URL, credenciales)
    }
}
export default new LoginService