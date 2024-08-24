import React, { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import PersonaService from '../services/PersonaService';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ErrorMessage from './functionalComponents/ErrorMessageComponent';
import Swal from 'sweetalert2';


export const AddPersonaComponent = () => {

    const [nombre, setNombre] = useState('')
    const [apellido, setApellido] = useState('')
    const [ci, setCi] = useState('')
    const [fechaNacimiento, setFechaNacimiento] = useState(null)
    const [numeroTelefono, setNumeroTelefono] = useState('')
    const [activo, setActivo] = useState(true)
    const [errors, setErrors] = useState({});

    const navigate = useNavigate()
    // Este hook apunta al parametro de la URL ej persona/$id
    const { id } = useParams()

    const saveOrUpdatePersona = (e) => {
        e.preventDefault()
        const formattedFechaNacimiento = fechaNacimiento ? format(fechaNacimiento, 'yyyy-MM-dd') + 'T12:00:00' : null;
        const persona = { nombre, apellido, ci, fechaNacimiento: formattedFechaNacimiento , numeroTelefono, activo }
        if (id) {
            PersonaService.updatePersona(id, persona).then((res) => {
                let timerInterval;
                Swal.fire({
                    title: 'Persona modificada con éxito',
                    timer: 2000,
                    timerProgressBar: true,
                    didOpen: () => {
                        Swal.showLoading();
                    },
                    willClose: () => {
                        clearInterval(timerInterval);
                    }
                }).then((result) => {
                    if (result.dismiss === Swal.DismissReason.timer) {
                        navigate('/personas');
                    }
                });
                setErrors({});
                navigate('/personas')
            }).catch(error => {
                if (error.response) {
                    setErrors(
                        error.response.data === 'Error de integridad de datos' 
                        ? { ci: 'Cedula ya registrada' } 
                        : error.response.data
                    );
                }
            })
        } else {
            PersonaService.createPersona(persona).then((res) => {
                let timerInterval;
                Swal.fire({
                    title: 'Persona registrada con éxito',
                    timer: 2000,
                    timerProgressBar: true,
                    didOpen: () => {
                        Swal.showLoading();
                    },
                    willClose: () => {
                        clearInterval(timerInterval);
                    }
                }).then((result) => {
                    if (result.dismiss === Swal.DismissReason.timer) {
                        navigate('/edit-persona/' + res.data.id);
                    }
                });
                setErrors({});
                navigate('/edit-persona/' + res.data.id);
            }).catch(error => {
                if (error.response?.data === 'Error de integridad de datos') {
                    setErrors({ ci: 'Cédula ya registrada' });
                } else if(error.response?.data?.length===0 && fechaNacimiento===null) {
                    setErrors({ fechaNacimiento: 'Debe ingresar feha de nacimiento' });   
                } else {
                    setErrors(error.response.data)
                }
            })
        }
    }

    // Este efecto es para cuando voy a actualizar una persona, que me traiga los datos actuales de esa persona
    useEffect(() => {
        if (id !== undefined) {
            PersonaService.getPersonaById(id)
                .then((res) => {
                    setNombre(res.data.nombre);
                    setApellido(res.data.apellido);
                    setCi(res.data.ci);
                    setFechaNacimiento(res.data.fechaNacimiento);
                    setNumeroTelefono(res.data.numeroTelefono);
                    setActivo(res.data.activo);
                })
                .catch((e) => {
                    setErrors(e.response.data);
                });
        }
    }, [id]);


    const handleCheckboxChange = (e) => {
        setActivo(e.target.checked);
    }

    const title = () => {
        if (id) {
            return <h2 className='text-center'>Actualizar Persona</h2>
        } else {
            return <h2 className='text-center'>Registrar Persona</h2>
        }
    }

    const goToChangePassword = () => { 
        navigate(`/resetpassword/${id}?data=${true}`);
    };

    return (
        <div className='d-flex justify-content-center align-items-center mt-3 row'>
            <div className='card cardForm col-lg-8'>
                <div className='card-header'>
                    <h2 className='text-center'>{title()}</h2>
                </div>
                <div className='card-body'>
                    <form>
                        {/*---- NOMBRE -----*/}
                        <div className='form-group my-3'>
                            <label className='form-label mb-2'>Nombre</label>
                            <input type='text' name='nombre' className='form-control' value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                            {errors.nombre && <div className="alert alert-danger mt-2" role="alert">{errors.nombre}</div>}
                        </div>
                        {/*---- APELLIDO -----*/}
                        <div className='form-group my-3'>
                            <label className='form-label'>Apellido</label>
                            <input type='text' name='apellido' className='form-control' value={apellido} onChange={(e) => setApellido(e.target.value)} required />
                            {errors.apellido && <div className="alert alert-danger mt-2" role="alert">{errors.apellido}</div>}
                        </div>
                        {/*---- CEDULA -----*/}
                        <div className='form-group my-3'>
                            <label className='form-label'>Cédula</label>
                            <input type='text' name='ci' className='form-control' value={ci} onChange={(e) => setCi(e.target.value)} required />
                            {errors.ci && <div className="alert alert-danger mt-2" role="alert">{errors.ci}</div>}
                        </div>
                        {/*---- FECHA NACIMIENTO -----*/}
                        <div className='form-group my-3'>
                            <label className='form-label'>Fecha nacimiento</label>
                            <br />
                            <DatePicker
                                selected={fechaNacimiento}
                                onChange={date => setFechaNacimiento(date)}
                                className='form-control'
                                dateFormat='yyyy-MM-dd'
                            />
                            {errors.fechaNacimiento && <div className="alert alert-danger mt-2" role="alert">{errors.fechaNacimiento}</div>}
                        </div>
                        {/*---- TELEFONO -----*/}
                        <div className='form-group'>
                            <label className='form-label'>Número teléfono</label>
                            <input
                                type='text'
                                name='telefono'
                                className='form-control'
                                value={numeroTelefono}
                                onChange={(e) => setNumeroTelefono(e.target.value)}
                                required
                            />
                            {errors.numeroTelefono && <div className="alert alert-danger mt-2" role="alert">{errors.numeroTelefono}</div>}
                        </div>
                        <div className='form-group form-check my-3'>
                            <input type='checkbox' name='activo' className='form-check-input' checked={activo} onChange={handleCheckboxChange} />
                            <label className='form-check-label'>Activo</label>
                        </div>
                        {id && (
                            <Link to={`/assign-rol/${id}`} className='btn btn-info ml-2'>
                                Asignar rol
                            </Link>
                        )}
                        <button className='btn btn-success mx-2' onClick={(e) => saveOrUpdatePersona(e)}>Guardar</button>
                        <Link to={'/personas'} className='btn btn-danger ml-2'>Cancelar</Link>
                        <button type='button' className='btn btn-primary mx-2' onClick={goToChangePassword}>Ir a Cambiar Contraseña</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddPersonaComponent