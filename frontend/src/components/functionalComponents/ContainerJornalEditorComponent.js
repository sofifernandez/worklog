import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext';
import ObraService from '../../services/ObraService';
import JornalService from '../../services/JornalService';
import JefeObraService from '../../services/JefeObraService';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import JornalEditorFormComponent from './JornalEditorFormComponent';
import ErrorMessage from './ErrorMessageComponent';
import Swal from 'sweetalert2';


export const ContainerJornalEditorComponent = () => {
    const { id } = useParams()
    const { personaRolLoggeado } = useAuth();

    const [isModify, setIsModify] = useState(false);


    const navigate = useNavigate();
    const [obras, setObras] = useState([]);
    const [fechaJornal, setFechaJornal] = useState();
    const [horaComienzo, setHoraComienzo] = useState(format(new Date(), 'HH:mm'));
    const [horaFin, setHoraFin] = useState();
    const [tipoJornal, setTipoJornal] = useState();
    const [persona, setPersona] = useState();

    const [obraSeleccionada, setObraSeleccionada] = useState();
    const [motivo, setMotivo] = useState()
    const [otroMotivo, setOtroMotivo] = useState('')

    const [modificado, setModificado] = useState(false)
    const [confirmado, setConfirmado] = useState(false)
    const [mensajeError, setMensajeError] = useState();



  /*--------SETEO INICIAL DEL FORM ------------------ */
    useEffect(() => {
        if (id) {
            setIsModify(true)
            JornalService.getJornalById(id).then((res) => {
                setObras([res.data.obra])
                setObraSeleccionada(res.data.obra)
                setFechaJornal(res.data.fechaJornal)
                setHoraComienzo(format(res.data.horaComienzo, 'HH:mm'))
                setPersona(res.data.persona)
                setTipoJornal(res.data.tipoJornal)
                setModificado(res.data.modificado)
                setConfirmado(res.data.confirmado)
                if (res.data.horaFin) {
                    setHoraFin(format(res.data.horaFin, 'HH:mm'))
                }
            }).catch(e => {
                e.response?.data ? setMensajeError(e.response.data):
                setMensajeError(e.message)
            })
            
        }
        else {
            if (personaRolLoggeado.personaRol.rol.rol === 'JEFE_OBRA') {
                fetchObraByJefe(personaRolLoggeado.id)
            }
            if (personaRolLoggeado.personaRol.rol.rol === 'ADMINISTRADOR') {
                fetchAllObras()
            }
            setFechaJornal(new Date())
            setHoraComienzo(format(new Date(), 'HH:mm'))
            setTipoJornal({ id: 1 })
        }
    }, [id])


  /*-------FETCH OBRAS ------------------ */
    const fetchObraByJefe = async (id) => {
        try {
            const obraData = await JefeObraService.getObraByJefeId(id);
            setObras([obraData.data]);
        } catch (error) {
            setMensajeError(error.response?.data || "ERROR");
        }
    };

    const fetchAllObras = async () => {
        try {
            const obrasData = await ObraService.getAllObras();
            setObras(obrasData.data)
        } catch (error) {
            setMensajeError(error.response?.data || "ERROR");
        }
    }


    /*-------AGREGAR O EDITAR JORNAL ------------------ */
    const handleConfirmar = async (e) => {
        setMensajeError();
        e.preventDefault();

        try {
            const fechaFormatted= format(fechaJornal, 'yyyy-MM-dd')
            await JornalService.validateDatos(persona, obraSeleccionada, fechaFormatted, horaComienzo, horaFin, tipoJornal, modificado, confirmado)
        } catch (error) {
            if (error.response) {
                // Handle server-side errors
                setMensajeError(error.response.data);
            } else {
                // Handle other JavaScript errors
                setMensajeError(error.message);
            }
            return;

        }


        // Modify Update jornal
        const fechaFormatted= format(fechaJornal, 'yyyy-MM-dd')
        const horaComienzoFormatted = fechaFormatted + 'T' + horaComienzo;
        const horaFinFormatted = fechaFormatted + 'T' + horaFin;
        const jornal = { persona, obra:obraSeleccionada, fechaJornal:fechaFormatted, horaComienzo: horaComienzoFormatted, horaFin: horaFinFormatted, tipoJornal, modificado, confirmado }
        if (id) {
            var motivoDefinitivo = '';
            if (motivo === 'Otros') { motivoDefinitivo = otroMotivo; } else { motivoDefinitivo = motivo }
            JornalService.updateJornal(id, motivoDefinitivo, jornal).then((res) => {
                Swal.fire({
                    title: 'Jornal modificado con éxito',
                    showConfirmButton: true, // Show the close button
                    icon: 'success',
                    confirmButtonText: 'Cerrar', // Customize the button text
                }).then(() => {
                    navigate('/last-jornales');
                });
            }).catch(error => {
                if (error.response) {
                    setMensajeError(error.response.data);
                } else if (error.request) {
                    setMensajeError('No hay respuesta del servidor');
                } else {
                    setMensajeError(error.message);
                }
            });
        } else {
            JornalService.createJornal(jornal).then((res) => {
                Swal.fire({
                    title: 'Jornal ingresado con éxito',
                    showConfirmButton: true, // Show the close button
                    icon: 'success',
                    confirmButtonText: 'Cerrar', // Customize the button text
                }).then(() => {
                    navigate('/add-jornal');
                });
            }).catch(error => {
                if (error.response) {
                    setMensajeError(error.response.data);
                } else if (error.request) {
                    setMensajeError('No hay respuesta del servidor');
                } else {
                    setMensajeError(error.message);
                }
            });
        }

    };

    


    const handleSelectObra= (obraId) => {
        const selectedObra = obras.find(obra => obra.id === parseInt(obraId));
        setObraSeleccionada(selectedObra);

    }


    const handleCancelar = () => {
        navigate('/home')
    }

    const handleAlertCloseError=()=> {
        setMensajeError()
    }


    return (
        <div className='d-flex justify-content-center align-items-center mt-3 row'>
            <JornalEditorFormComponent
                isModify={isModify}
                obras={obras}
                persona={persona}
                fechaJornal={fechaJornal}
                horaComienzo={horaComienzo}
                horaFin={horaFin}
                tipoJornal={tipoJornal}
                onSeleccionarObra={handleSelectObra}
                onSeleccionarPersona={(p) => setPersona(p)}
                onSeleccionarFecha={(f) => setFechaJornal(f)}
                onSeleccionarHoraComienzo={(hc) => setHoraComienzo(hc)}
                onSeleccionarHoraFin={(hf) => setHoraFin(hf)}
                onSeleccionarTipo={(t) => setTipoJornal(t)}
                onSeleccionarMotivo={(m) => setMotivo(m)}
                onSeleccionarOtroMotivo={(om) => setOtroMotivo(om)}
            />


           <div className='row justify-content-center mt-4'> {mensajeError && <ErrorMessage mensajeError={mensajeError} handleAlertClose={handleAlertCloseError} />}</div>
        
            <div className='row justify-content-center mt-4'>
                <button className="btn btn-primary col-5 col-lg-3 ms-3 mb-3" type="button" onClick={(e) => handleConfirmar(e)}>Confirmar</button>
                <button className="btn btn-danger col-5 col-lg-3 ms-3 mb-3 " type="button" onClick={handleCancelar}>Cancelar</button>
            </div>
        </div>
    )
}

export default ContainerJornalEditorComponent;