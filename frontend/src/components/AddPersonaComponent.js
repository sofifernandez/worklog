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
    const navigate = useNavigate()
    // Este hook apunta al parametro de la URL ej persona/$id
    const { id } = useParams()

    const saveOrUpdatePersona = (e) => {
        e.preventDefault()
        const persona = { nombre, apellido, ci, fechaNacimiento, numeroTelefono, activo }

        if (id) {
            PersonaService.updatePersona(id, persona).then((res) => {
                console.log(res.data)
                navigate('/personas')
            }).catch(e => {
                console.log(e)
            })
        } else {
            console.log(persona)
            PersonaService.createPersona(persona).then((res) => {
                console.log(res.data)
                navigate('/personas')
            }).catch(e => {
                console.log(e)
            })
        }

    }

    // Este efecto es para cuando voy a actualizar una persona, que me traiga los datos actuales de esa persona
    useEffect(() => {
        console.log(id)
        PersonaService.getPersonaById(id).then((res) => {

            setNombre(res.data.nombre)
            setApellido(res.data.apellido)
            setCi(res.data.ci)
            setFechaNacimiento(res.data.fechaNacimiento)
            setNumeroTelefono(res.data.numeroTelefono)
            setActivo(res.data.activo)
            console.log(id)
        }).catch(e => {
            console.log(e)
        })
    }, [])

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
        <div>
            <div className='contenedor'>
                <div className='row'>
                    <div>
                        <h2 className='text-center'>{title()}</h2>
                        <div className='card-body'>
                            <form className=''>
                                <div className='form-group'>
                                    <label className='form-label mb-2'>Nombre</label>
                                    <input type='text' name='nombre' className='form-control' value={nombre} onChange={(e) => setNombre(e.target.value)} />
                                </div>
                                <div className='form-group'>
                                    <label className='form-label'>Apellido</label>
                                    <input type='text' name='apellido' className='form-control' value={apellido} onChange={(e) => setApellido(e.target.value)} />
                                </div>
                                <div className='form-group'>
                                    <label className='form-label'>Cedula</label>
                                    <input type='text' name='ci' className='form-control' value={ci} onChange={(e) => setCi(e.target.value)} />
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
                                    <input type='text' name='telefono' className='form-control' value={numeroTelefono} onChange={(e) => setNumeroTelefono(e.target.value)} />
                                </div>
                                <div className='form-group'>
                                    <label className='form-label'>Activo</label>
                                    <input type='checkbox' name='activo' className='form-check-input m-2' checked={activo} onChange={handleCheckboxChange} />
                                </div>
                                <button className='btn btn-success' onClick={(e) => saveOrUpdatePersona(e)}>Guardar</button>

                                <Link to={'/personas'} className='btn btn-danger ml-2'>Cancelar</Link>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddPersonaComponent