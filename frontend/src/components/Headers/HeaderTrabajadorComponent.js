
import React from 'react'
import { useAuth } from '../../context/AuthContext';
import myIcon from '../../Images/Imagen1.svg'
import '../../style/headerComponent.css'
import LogoutComponent from '../LogoutComponent';

const HeaderTrabajadorComponent = () => {
    const { personaRolLoggeado } = useAuth();
    return (
        <div className=''>
            <nav className="navbar navbar-expand-lg navbar-dark ">
                <div id='div-img' className='mr-5'><img id='logo-header' src={myIcon} alt="My Icon" /></div>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item active mx-2 px-2 ">
                            <a className="nav-link" href="/home">Inicio <span className="sr-only">(current)</span></a>
                        </li>
                        <li className="nav-item dropdown mx-2 px-2">
                            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLinkPersonas" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Jornal
                            </a>
                            <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLinkPersonas">
                                <a className="dropdown-item" href="/">Entrada/Salida</a>
                                <a className="dropdown-item" href="/">Modificar</a>
                                <a className="dropdown-item" href="/">Buscar</a>
                            </div>
                        </li>
                    </ul>
                    <div className="row my-2 my-lg-0">
                        <div className='m-auto d-none d-lg-block' id="nombreUsuario">Hola {personaRolLoggeado.persona.nombre}!</div>
                        <LogoutComponent/>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default HeaderTrabajadorComponent