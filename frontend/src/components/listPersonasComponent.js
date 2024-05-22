import React, { useState } from 'react'

export const listPersonasComponent = () => {

    const [personas, setPersonas] = useState([])

    return (
        <div className='container'>
            <h2 className='text-center'>Lista de personas</h2>
            <table className='table table-striped'>
                <thead>
                    <th>Id</th>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Fecha Nacimiento</th>
                </thead>
                <tbody>
                    {personas.map(p =>
                        <tr key={p.id}>
                            <td >{p.id}</td>
                            <td >{p.nombre}</td>
                            <td >{p.apellido}</td>
                            <td >{p.fechaNacimiento}</td>
                        </tr>
                    )}
                </tbody>

            </table>
        </div>
    )
}

export default listPersonasComponent
