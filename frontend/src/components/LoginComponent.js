import React, { useEffect, useState } from 'react'
//import { useNavigate } from 'react-router-dom';
import LoginService from '../services/LoginService';


const LoginComponent = () => {
    
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState({});
    //const navigate = useNavigate();
    //const mostrarMenu = event => navigate('/', { replace: true });

    const intentarLogin = (e) => {
            e.preventDefault()
            const credenciales = { username, password }
            LoginService.iniciarSesion(credenciales).then((res) => {
                window.localStorage.setItem(
                    'appJornalesToken', res.data.token
                )
                window.location.reload();
            }).catch(error => {
                if (error.response && error.response.status === 403) {
                    setErrors({ login: 'Usuario y/o contraseña incorrecto/s' });
                    }
            })
        
    }

    return(
        <div className='d-flex justify-content-center align-items-center min-vh-100'>
            <div className='col-md-15'>
                <div className='card'>
                    <div className='card-header'>
                        <h2 className='text-center'>Inicio de Sesión</h2>
                    </div>
                    <div className='card-body'>
                        <form>
                            <div className='form-group'>
                               <label className="form-label">Usuario</label>
                                <input 
                                    type="login" 
                                    id="username" 
                                    name="username" 
                                    className="form-control" 
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <div className='form-group'>
                                <label className="form-label">Contraseña</label>
                                <input 
                                    type="password" 
                                    id="password" 
                                    name="password" 
                                    className="form-control" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                {errors.login && <div className="alert alert-danger mt-2" role="alert">{errors.login}</div>}
                            </div>               
                            <button className='btn btn-success' onClick={(e) => intentarLogin(e)}>Iniciar Sesión</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>    
    );
}

export default LoginComponent

