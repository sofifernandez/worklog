
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
                <div className="collapse navbar-collapse justify-content-lg-between" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item active mx-2 px-2 ">
                            <a className="nav-link" href="/home">Inicio</a>
                        </li>
                        <li className="nav-item dropdown mx-2 px-2">
                            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLinkJornales" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Jornal
                            </a>
                            <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLinkJornales">
                                <a className="dropdown-item" href="/">Entrada/Salida</a>
                                <a className="dropdown-item" href="/buscar-jornal">Buscar</a>
                            </div>
                        </li>
                    </ul>
                    <div className="row my-2 my-lg-0 mx-0">
                        <div className='d-none d-lg-block col-lg-7 my-auto' id="nombreUsuario">Hola {personaRolLoggeado.nombre}!</div>
                        <div className='col-lg-5'><LogoutComponent/></div>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default HeaderTrabajadorComponent