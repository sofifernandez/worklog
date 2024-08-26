import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faSquarePlus } from '@fortawesome/free-solid-svg-icons';

const DatoPersonaComponent = ({ persona, minimalData, handleRowClick }) => {

    return (
        <tr key={persona.id} onClick={minimalData ? () => handleRowClick(persona) : null}>
            {/*---- ACCION-------- */}
            {!minimalData && (<td ><Link className='btn btnActualizar' to={`/edit-persona/${persona.id}`}>Actualizar</Link></td>)}
            {minimalData && (<td className='text-center' title='Agregar'><FontAwesomeIcon icon={faSquarePlus} /></td>)}
            {/*---- NOMBRE COMPLETO-------- */}
            <td >{persona.nombre} {persona.apellido}</td>
            {/*---- CEDULA-------- */}
            <td >{persona.ci}</td>
            {/*---- FECHA NAC-------- */}
            {!minimalData && (<td>{persona.fechaNacimiento}</td>)}
            {/*---- ROL-------- */}
            {!minimalData && (<td>
                <Link className='btn btn-info' title='Editar' to={`/assign-rol/${persona.id}`}>
                    {persona.personaRol ? persona.personaRol.rol.rol : 'Sin rol'}
                </Link>
            </td>)}
            {minimalData && (<td>
                {persona.personaRol ? persona.personaRol.rol.rol : 'Sin rol'}
            </td>)}
            {/*---- ACTIVO-------- */}
            {!minimalData && (
                <td>
                    <FontAwesomeIcon
                        icon={faCircle}
                        style={{ color: persona.activo ? 'green' : 'red' }}
                    />
                </td>
            )}
        </tr>

    );





};

export default DatoPersonaComponent;









