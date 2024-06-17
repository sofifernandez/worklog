import axios from "axios"

const LOGIN_BASE_REST_API_URL = "http://localhost:8080/login"
//const LOGIN_BASE_REST_API_URL = "http://18.205.219.216:8080/login"

class LoginService{

    iniciarSesion(credenciales){
        return axios.post(LOGIN_BASE_REST_API_URL, credenciales)
    }
}
export default new LoginService