import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudRain, faE, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';


const DatoPersonaComponent = ({ jornal, onlyRows }) => {

    const formatTime = (timestamp,jornalId) => {
        if(!timestamp){
            return (
                <Link className='btn text-center' to={`/salida-jornal/${jornalId}`} title='Marcar salida'>
                  <FontAwesomeIcon icon={faArrowRightFromBracket} />
                </Link>
              );
        }
        const date = new Date(timestamp);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const day = date.getDate().toString().padStart(2, '0');
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
                                {/* <th> </th> */}
                                <th> </th>
                                <th className="text-center">Fecha</th>
                                <th className="text-center">Obra</th>
                                <th className="text-center">Ingreso</th>
                                <th className="text-center">Salida</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr key={jornal.id}>
                                {/* <td ><Link className='btn editarJornal' to={`/edit-jornal/${jornal.id}`} title='Editar'><FontAwesomeIcon icon={faPenToSquare} /></Link></td> */}
                                <td className="text-center lluvia" title='LLuvia'>
                                    {jornal.tipoJornal.tipoJornal === "2" && <FontAwesomeIcon icon={faCloudRain} />}
                                    {jornal.tipoJornal.tipoJornal === "3" && <FontAwesomeIcon icon={faE} />}
                                </td>
                                <td className="text-center">{formatDate(jornal.fechaJornal)}</td>
                                <td className="text-center">{jornal.obra.nombre}</td>
                                <td className="text-center">{formatTime(jornal.horaComienzo)}</td>
                                <td className="text-center">{formatTime(jornal.horaFin, jornal.id)}</td>
                                
                            </tr>
                        </tbody>
                    </table>
                )}

            {onlyRows && (
                <tr key={jornal.id}>
                    {/* <td ><Link className='btn editarJornal' to={`/edit-jornal/${jornal.id}`} title='Editar'><FontAwesomeIcon icon={faPenToSquare} /></Link></td> */}
                    <td className="text-center lluvia" title='LLuvia'>
                        {jornal.tipoJornal.tipoJornal === "2" && <FontAwesomeIcon icon={faCloudRain} />}
                        {jornal.tipoJornal.tipoJornal === "3" && <FontAwesomeIcon icon={faE} />}
                    </td>
                    <td className="text-center">{formatDate(jornal.fechaJornal)}</td>
                    <td className="text-center">{jornal.obra.nombre}</td>
                    <td className="text-center">{formatTime(jornal.horaComienzo)}</td>
                    <td className="text-center">{formatTime(jornal.horaFin, jornal.id)}</td>
                </tr>

            )
            }

        </>

    );





};

export default DatoPersonaComponent;









