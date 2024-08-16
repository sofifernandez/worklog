import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudRain, faE, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { faCircle } from '@fortawesome/free-solid-svg-icons';


const DatoPersonaComponent = ({ jornal, onlyRows, adminView }) => {

    const formatTime = (timestamp,jornalId) => {
        if(!timestamp){
            if(!adminView){
                return (
                    <Link className='btn text-center' to={`/salida-jornal/${jornalId}`} title='Marcar salida'>
                      <FontAwesomeIcon icon={faArrowRightFromBracket} />
                    </Link>
                  );
            } else {
                return (<p>--</p>)
            }
           
        }
        const date = new Date(timestamp);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const day = timestamp.slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() returns 0-11
        const year = date.getFullYear().toString().slice(-2); // get last two digits of the year
        return `${day}/${month}/${year}`;
    };



    return (

        <>
            {!onlyRows &&

                (
                    <table className='table table-sm table-bordered table-striped mt-3'>
                        <thead>
                            <tr>
                                {adminView && (<th className="text-center">Nombre</th>)}
                                <th> </th>
                                <th className="text-center">Fecha</th>
                                <th className="text-center">Obra</th>
                                <th className="text-center">Ingreso</th>
                                <th className="text-center">Salida</th>
                                {adminView && (<th className="text-center">Confirmado</th>)}
                                {adminView && (<th className="text-center">Acciones</th>)}
                                
                            </tr>
                        </thead>
                        <tbody>
                            <tr key={jornal.id}>
                                {adminView &&(<th className="text-center">{jornal.persona.nombre} {jornal.persona.apellido} </th>)}
                                {/* <td ><Link className='btn editarJornal' to={`/edit-jornal/${jornal.id}`} title='Editar'><FontAwesomeIcon icon={faPenToSquare} /></Link></td> */}
                                <td className="text-center lluvia" title='LLuvia'>
                                    {jornal.tipoJornal.tipoJornal === "2" && <FontAwesomeIcon icon={faCloudRain} />}
                                    {jornal.tipoJornal.tipoJornal === "3" && <FontAwesomeIcon icon={faE} />}
                                </td>
                                <td className="text-center">{formatDate(jornal.fechaJornal)}</td>
                                <td className="text-center">{jornal.obra.nombre}</td>
                                <td className="text-center">{formatTime(jornal.horaComienzo)}</td>
                                <td className="text-center">{formatTime(jornal.horaFin, jornal.id)}</td>
                                {adminView &&(<td className="text-center">
                                                <Link className='btn btn-info mx-1' to={`/edit-obra/${jornal.id}`}>Modificar</Link>
                                                <button className='btn btn-danger mx-1' onClick={() => formatDate(jornal.id)}>Eliminar</button>
                                             </td>)}
                            </tr>
                        </tbody>
                    </table>
                )}

            {onlyRows && (
                <tr key={jornal.id}>
                    {adminView &&(<th className="text-center">{jornal.persona.nombre} {jornal.persona.apellido} </th>)}
                    {/* <td ><Link className='btn editarJornal' to={`/edit-jornal/${jornal.id}`} title='Editar'><FontAwesomeIcon icon={faPenToSquare} /></Link></td> */}
                    <td className="text-center lluvia" title='LLuvia'>
                        {jornal.tipoJornal.tipoJornal === "2" && <FontAwesomeIcon icon={faCloudRain} />}
                        {jornal.tipoJornal.tipoJornal === "3" && <FontAwesomeIcon icon={faE} />}
                    </td>
                    <td className="text-center">{formatDate(jornal.fechaJornal)}</td>
                    <td className="text-center">{jornal.obra.nombre}</td>
                    <td className="text-center">{formatTime(jornal.horaComienzo)}</td>
                    <td className="text-center">{formatTime(jornal.horaFin, jornal.id)}</td>
                    {adminView &&(<td className="text-center"> <FontAwesomeIcon
                                        icon={faCircle}
                                        style={{ color: jornal.confirmado ? 'green' : 'red' }}
                                    /> </td>)
                                    }
                    {adminView &&(<td className="text-center">
                                                <Link className='btn btn-info mx-1' to={`/modify-jornal/${jornal.id}`}>Modificar</Link>
                                                <Link className='btn btn-danger mx-1' to={`/delete-jornal/${jornal.id}`}>Eliminar</Link>
                                             </td>)}
                </tr>

            )
            }

        </>

    );





};

export default DatoPersonaComponent;









