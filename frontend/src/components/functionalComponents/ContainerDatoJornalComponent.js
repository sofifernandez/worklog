
import DatoJornalComponent from "./DatoJornalComponent";
import { useState } from "react";
import ErrorMessage from './ErrorMessageComponent';
import SuccessMessage from './SuccessMessageComponent';
import { useAuth } from '../../context/AuthContext';

const ContainerDatoJornalComponent = ({ jornales, adminView, jefeView }) => {
    const { setRefreshJornales } = useAuth();
    const [mensajeError, setMensajeError] = useState([]);
    const [mensajeSuccess, setMensajeSuccess] = useState([]);

    const handleFetchError = (error) => {
        setMensajeError(prevErrors => [...prevErrors, error]);
        setRefreshJornales(true)
    };

    const handleFetchSuccess = (message) => {
        setMensajeSuccess(prevMessages => [...prevMessages, message]);
        setRefreshJornales(true)
    };

    const handleAlertCloseError = (index) => {
        setMensajeError(prevErrors => prevErrors.filter((_, i) => i !== index));
        setRefreshJornales(true)
    };

    const handleAlertCloseSuccess = (index) => {
        setMensajeSuccess(prevMessages => prevMessages.filter((_, i) => i !== index));
        setRefreshJornales(true)
    };

    return (
        <><table className='table table-sm table-bordered  mt-3'>
            <thead>
                <tr>
                    {/* <th> </th> */}
                    {(adminView || jefeView) && (<th className="text-center">Nombre</th>)}
                    <th className="text-center">Tipo </th>
                    <th className="text-center">Fecha</th>
                    <th className="text-center">Obra</th>
                    <th className="text-center">Ingreso</th>
                    <th className="text-center">Salida</th>
                    {(adminView || jefeView) && (<th className="text-center">Confirmado</th>)}
                    {(adminView || jefeView) && (<th className="text-center">Acciones</th>)}
                </tr>
            </thead>
            <tbody>
                {jornales.map(p => <DatoJornalComponent
                    key={p.id}
                    jornal={p}
                    adminView={adminView}
                    jefeView={jefeView}
                    onError={handleFetchError}
                    onSuccess={handleFetchSuccess} />
                )}
            </tbody>
        </table>

            <div className='row justify-content-center mt-4'>
                {mensajeError.length > 0 && <ErrorMessage mensajeError={mensajeError} handleAlertClose={handleAlertCloseError} />}
                {mensajeSuccess.length > 0 && <SuccessMessage mensajeSuccess={mensajeSuccess} handleAlertClose={handleAlertCloseSuccess} />}
            </div></>
    );
};

export default ContainerDatoJornalComponent;









