import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';

const DatoPersonaComponent = ({ persona, onlyRows }) => {

    return (

        <>
            {!onlyRows &&

                (
                    <table className='table table-sm table-bordered table-striped mt-3'>
                        <thead>
                            <tr>
                            <th> </th>
                            <th>Nombre completo</th>
                            <th>Cédula</th>
                            <th>Fecha Nacimiento</th>
                            <th>Rol actual</th>
                            <th>Activo</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr key={persona.id}>
                                <td ><Link className='btn btn-info' to={`/edit-persona/${persona.id}`}>Actualizar</Link></td>
                                <td >{persona.nombre} {persona.apellido}</td>
                                <td >{persona.ci}</td>
                                <td>{persona.fechaNacimiento}</td>
                                <td>
                                    <Link className='btn btn-info' title='Editar' to={`/assign-rol/${persona.id}`}>
                                        {persona.personaRol ? persona.personaRol.rol.rol : 'Sin rol'}
                                    </Link>
                                </td>
                                <td>
                                    <FontAwesomeIcon
                                        icon={faCircle}
                                        style={{ color: persona.activo ? 'green' : 'red' }}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                )}

            {onlyRows && (
                <tr key={persona.id}>
                    <td ><Link className='btn btn-info' to={`/edit-persona/${persona.id}`}>Actualizar</Link></td>
                    <td >{persona.nombre} {persona.apellido}</td>
                    <td >{persona.ci}</td>
                    <td>{persona.fechaNacimiento}</td>
                    <td>
                        <Link className='btn btn-info' title='Editar' to={`/assign-rol/${persona.id}`}>
                            {persona.personaRol ? persona.personaRol.rol.rol : 'Sin rol'}
                        </Link>
                    </td>
                    <td>
                        <FontAwesomeIcon
                            icon={faCircle}
                            style={{ color: persona.activo ? 'green' : 'red' }}
                        />
                    </td>
                </tr>

            )
            }

        </>

    );





};

export default DatoPersonaComponent;









