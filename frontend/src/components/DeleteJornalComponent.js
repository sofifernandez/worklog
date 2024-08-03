import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext';
import JornalService from '../services/JornalService';
import DatePicker from 'react-datepicker';
import TimePicker from 'react-time-picker';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import ErrorMessage from './functionalComponents/ErrorMessageComponent';
import SuccessMessage from './functionalComponents/SuccessMessageComponent';
import Swal from 'sweetalert2';


export const DeleteJornalComponent = () => {
    const { id } = useParams()
    const { personaRolLoggeado } = useAuth();
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState();
    const [obra, setObra] = useState();
    const [fechaJornal, setFechaJornal] = useState();
    const [horaComienzo, setHoraComienzo] = useState(format(new Date(), 'HH:mm:ss'));
    const [horaFin, setHoraFin] = useState();
    const [tipoJornal, setTipoJornal] = useState();
    const [persona, setPersona] = useState();
    const [mensajeError, setMensajeError] = useState([]);
    const [mensajeSuccess, setMensajeSuccess] = useState([]);
    const [horaComienzoManual, setHoraComienzoManual] = useState(true)
    const [horaFinManual, setHoraFinManual] = useState(false)
    const [modificado, setModificado] = useState()
    const [confirmado, setConfirmado] = useState()
    const [motivo, setMotivo] = useState()
    const [otroMotivo, setOtroMotivo] = useState('')
    const [confirmar, setConfirmar] = useState(false)

    useEffect(() => {
      if(id){
        JornalService.getJornalById(id).then((res) => {
            setObra(res.data.obra)
            setFechaJornal(res.data.fechaJornal)
            setHoraComienzo(format(res.data.horaComienzo, 'HH:mm:ss'))
            setPersona(res.data.persona)
            setTipoJornal(res.data.tipoJornal)
            setModificado(res.data.modificado)
            setConfirmado(res.data.confirmado)
            if (res.data.horaFin){
                setHoraFin(format(res.data.horaFin, 'HH:mm:ss'))
            }
        }).catch(e => {
            console.log(e)
        })
      }
    }, [id])

    const handleConfirmar = async (e) => {
        setMensajeError([]);
        setMensajeSuccess([])
        e.preventDefault();

        // Update jornal
        const horaComienzoFormatted = fechaJornal + 'T' + horaComienzo;
        const horaFinFormatted = fechaJornal + 'T' + horaFin;
        const jornal = { persona, obra, fechaJornal, horaComienzo: horaComienzoFormatted, horaFin: horaFinFormatted, tipoJornal, modificado, confirmado}
        //var motivoDefinitivo = '';
        //if (motivo === 'Otros') {motivoDefinitivo =  otroMotivo;}else{motivoDefinitivo = motivo}
        JornalService.deleteJornal(id).then((res) => {  
            let timerInterval;
            Swal.fire({
               title: 'Jornal Eliminado con éxito',
               timer: 2500,
               timerProgressBar: true,
               didOpen: () => {
                   Swal.showLoading();
                },
               willClose: () => {
                clearInterval(timerInterval);
               }
               }).then((result) => {
                 if (result.dismiss === Swal.DismissReason.timer) {
                   navigate('/buscar-jornal/');
                }
               });
               navigate('/buscar-jornal/');
        }).catch(error => {
            if (error.response) {
                setMensajeError(error.response.data);
            }else if (error.request) {
                setMensajeError('No hay respuesta del servidor');
            }else{
                setMensajeError(error.message);
            }
        });
        
    };


    const handleCancelar = () => {
        navigate('/home')
    }




    return (
        <div className='d-flex justify-content-center align-items-center mt-3 row'>
            <div className='card cardForm col-lg-8'>
                <div className='card-header'>
                    <h2 className='text-center'>Eliminar jornal</h2>
                </div>
                <div className='card-body'>
                    <form>
                        {/*--------- OBRA/S--------------------------- */}
                        {obra && (
                                <div className='form-group mt-3'>
                                    <label className='form-label me-4 labelCard'>Obra</label>
                                    <label className="form-label me-4 border d-inline p-2 justify-content-center">
                                    {obra.nombre}
                                    </label>
                                </div>
                            )
                        }
                        {/*--------- FECHA--------------------------- */}
                        <div className='form-group mt-3'>
                            <label className='form-label me-4 labelCard'>Fecha</label>
                            <DatePicker
                                onChange={date => setFechaJornal(format(date, 'yyyy-MM-dd'))}
                                className='form-control'
                                dateFormat='yyyy-MM-dd'
                                value={fechaJornal}
                            />
                        </div>
                        {/*--------- HORA COMIENZO--------------------------- */}
                        {horaComienzoManual && (
                            <div className='form-group mt-3'>
                                <label className='form-label me-4 labelCard'>Hora Comienzo</label>
                                <label className="form-label me-4 border d-inline p-2 justify-content-center">
                                    {horaComienzo}
                                </label>
                            </div>
                        )}

                        {/*--------- HORA FIN--------------------------- */}
                        {(horaFinManual || id) && (
                            <div className='form-group mt-3'>
                                <label className='form-label me-4 labelCard'>Hora Fin</label>
                                <label className="form-label me-4 border d-inline p-2 justify-content-center">
                                    {horaFin}
                                </label>
                            </div>
                        )}

                        {/*--------- TRABAJADOR--------------------------- */}
                        <div className='form-group mt-3'>
                            {id && (<label className='form-label me-4 labelCard'>Trabajador</label>)}
                            {id && persona &&           
                                (<label className="form-label me-4 border d-inline p-2 justify-content-center">
                                    {persona.nombre} {persona.apellido}
                                </label>)
                            }
                        </div>
                        {/*--------- TIPO JORNAL--------------------------- */}
                        {tipoJornal && (
                        <div className='form-group mt-3'>

                            <label className='form-label me-4 labelCard'>Tipo de Jornal</label>
                            <label className="form-label me-4 border d-inline p-2 justify-content-center">
                                    {tipoJornal.tipoJornal}
                            </label>
                        </div>
                        )}

                        {confirmar && (
                         <div className='form-group mt-3 alert alert-warning alert-dismissible show' role='alert'><strong>Atención!</strong> Esta acción <u>no se puede deshacer</u>. ¿Está seguro/a que desea eliminar el jornal?</div>
                        )}

                    </form>
                </div>
                {mensajeError && <ErrorMessage mensajeError={mensajeError} />}
                {mensajeSuccess && <SuccessMessage mensajeSuccess={mensajeSuccess}  />}
            </div>
            {!confirmar && (
            <div className='row justify-content-center mt-4'>
                <button className="btn btn-primary col-5 col-lg-3 ms-3 mb-3" type="button" onClick={(e) => setConfirmar(true)}>Confirmar</button>
                <button className="btn btn-danger col-5 col-lg-3 ms-3 mb-3 " type="button" onClick={handleCancelar}>Cancelar</button>
            </div>
            )}

            {confirmar && (
            <div className='row justify-content-center mt-4'>
                <button className="btn btn-success col-5 col-lg-3 ms-3 mb-3" type="button" onClick={(e) => handleConfirmar(e)}>Si</button>
                <button className="btn btn-danger col-5 col-lg-3 ms-3 mb-3 " type="button" onClick={(e) => setConfirmar(false)}>No</button>
            </div>
            )}
        </div>
    )
}

export default DeleteJornalComponent;