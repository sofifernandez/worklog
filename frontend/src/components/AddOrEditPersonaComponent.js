import React, { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import PersonaService from '../services/PersonaService';
import { Link, useNavigate, useParams } from 'react-router-dom';


const AddPersonaComponent = () => {

    const [nombre, setNombre] = useState('')
    const [apellido, setApellido] = useState('')
    const [ci, setCi] = useState('')
    const [fechaNacimiento, setFechaNacimiento] = useState(null)
    const [numeroTelefono, setNumeroTelefono] = useState('')
    const [activo, setActivo] = useState(true)
    const [errors, setErrors] = useState({});
    const [personaAgregada, setPersonaAgregada] = useState();

    const navigate = useNavigate()
    // Este hook apunta al parametro de la URL ej persona/$id
    const { id } = useParams()

    const saveOrUpdatePersona = (e) => {
        e.preventDefault()
        const persona = { nombre, apellido, ci, fechaNacimiento, numeroTelefono, activo }

        if (id) {
            PersonaService.updatePersona(id, persona).then((res) => {
                navigate('/personas')
            }).catch(error => {
                if (error.response && error.response.status === 400) {
                    if (error.response.data === 'Error de integridad de datos') {
                        setErrors({ ci: 'Cedula ya registrada' });
                    } else {
                        setErrors(error.response.data)
                    }
                }
            })
        } else {
            PersonaService.createPersona(persona).then((res) => {
                setPersonaAgregada(res.data);
                navigate('/edit-persona/:' + personaAgregada.id);
            }).catch(error => {
                if (error.response && error.response.status === 400) {
                    if (error.response.data === 'Error de integridad de datos') {
                        setErrors({ ci: 'Cedula ya registrada' });
                    } else {
                        setErrors(error.response.data)
                    }
                }
            })
        }
    }

    // Este efecto es para cuando voy a actualizar una persona, que me traiga los datos actuales de esa persona
    useEffect(() => {
        PersonaService.getPersonaById(id).then((res) => {
            setNombre(res.data.nombre)
            setApellido(res.data.apellido)
            setCi(res.data.ci)
            setFechaNacimiento(res.data.fechaNacimiento)
            setNumeroTelefono(res.data.numeroTelefono)
            setActivo(res.data.activo)
        }).catch(e => {
            console.log(e)
        })
    }, [id])

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

    return (
        <div className='d-flex justify-content-center align-items-center mt-3 row'>
            <div className='card cardForm col-lg-8'>
                <div className='card-header'>
                    <h2 className='text-center'>{title()}</h2>
                </div>
                <div className='card-body'>
                    <form>
                        <div className='form-group'>
                            <label className='form-label mb-2'>Nombre</label>
                            <input type='text' name='nombre' className='form-control' value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                            {errors.nombre && <div className="alert alert-danger mt-2" role="alert">{errors.nombre}</div>}
                        </div>
                        <div className='form-group'>
                            <label className='form-label'>Apellido</label>
                            <input type='text' name='apellido' className='form-control' value={apellido} onChange={(e) => setApellido(e.target.value)} required />
                            {errors.apellido && <div className="alert alert-danger mt-2" role="alert">{errors.apellido}</div>}
                        </div>
                        <div className='form-group'>
                            <label className='form-label'>Cedula</label>
                            <input type='text' name='ci' className='form-control' value={ci} onChange={(e) => setCi(e.target.value)} required />
                            {errors.ci && <div className="alert alert-danger mt-2" role="alert">{errors.ci}</div>}
                        </div>
                        <div className='form-group'>
                            <label className='form-label'>Fecha Nacimiento</label>
                            <DatePicker
                                selected={fechaNacimiento}
                                onChange={date => setFechaNacimiento(format(date, 'yyyy-MM-dd'))}
                                className='form-control'
                                dateFormat='yyyy-MM-dd'
                            />
                        </div>
                        <div className='form-group'>
                            <label className='form-label'>Numero Telefono</label>
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
                        <div className='form-group form-check'>
                            <input type='checkbox' name='activo' className='form-check-input' checked={activo} onChange={handleCheckboxChange} />
                            <label className='form-check-label m-2'>Activo</label>
                        </div>
                        {personaAgregada && (
                            <Link to={`/assign-rol/${personaAgregada.id}`} className='btn btn-info ml-2'>
                                Agregar rol
                            </Link>
                        )}
                        <button className='btn btn-success mx-2' onClick={(e) => saveOrUpdatePersona(e)}>Guardar</button>
                        <Link to={'/personas'} className='btn btn-danger ml-2'>Cancelar</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddPersonaComponent