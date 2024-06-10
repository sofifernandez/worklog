import Axios from 'axios';
import { jwtDecode } from "jwt-decode";

export function initAxiosInterceptors() {

    Axios.interceptors.request.use(function(request){
        const token = window.localStorage.getItem('appJornalesToken');
        if (token) {
            request.headers['Authorization'] = `Bearer ${token}`;
        } else {
            request.headers['Authorization'] = null;
        }
        return request;
      }
    );
    
};

export function isValidToken() {

  let token = localStorage.getItem('appJornalesToken');
  let decodedToken = jwtDecode(token);
  //console.log("Decoded Token", decodedToken);
  let currentDate = new Date();

  // Verifico tiempo de expiración en segundos
  console.log(decodedToken.exp)
  console.log(decodedToken.exp * 1000)
  console.log(currentDate.getTime())
  console.log(decodedToken.exp * 1000 > currentDate.getTime()) 
  return (decodedToken.exp * 1000 > currentDate.getTime()) 

};