import React from 'react'
import { useAuth } from '../../context/AuthContext';
import myIcon from '../../Images/Imagen1.svg'
import '../../style/headerComponent.css'

const HeaderAdminComponent = () => {
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
                                Personas
                            </a>
                            <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLinkPersonas">
                                <a className="dropdown-item" href="/add-persona">Agregar</a>
                                <a className="dropdown-item" href="/personas">Buscar</a>
                                <a className="dropdown-item" href="/assign-rol">Gestionar roles</a>
                            </div>
                        </li>
                        <li className="nav-item dropdown mx-2 px-2">
                            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLinkObras" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Obras
                            </a>
                            <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLinkObras">
                                <a className="dropdown-item" href="/add-obra">Agregar</a>
                                <a className="dropdown-item" href="/obras">Buscar</a>
                                <a className="dropdown-item" href="#">Asignar Jefe de Obra</a>
                            </div>
                        </li>
                        <li className="nav-item dropdown mx-2 px-2">
                            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLinkReportes" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Reportes
                            </a>
                            <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLinkReportes">
                                <a className="dropdown-item" href="#">Obtener nuevo reporte</a>
                                <a className="dropdown-item" href="#">Historial</a>
                            </div>
                        </li>

                    </ul>
                    <div className="row my-2 my-lg-0">
                        <div className='m-auto d-none d-lg-block' id="nombreUsuario">Hola {personaRolLoggeado.persona.nombre}!</div>
                        <a className="btn btn-danger mx-3" href='/logout' role="button">Salir</a>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default HeaderAdminComponent