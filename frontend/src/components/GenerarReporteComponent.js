
import ReporteService from "../services/ReporteService";
import React, { useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css';
import ObraService from "../services/ObraService";
import JornalFinderFormComponent from "./functionalComponents/JornalFinderFormComponent";
import ErrorMessage from './functionalComponents/ErrorMessageComponent';
import { useNavigate } from 'react-router-dom';
import JornalService from "../services/JornalService";

const GenerarReporteComponent = () => {
    const navigate = useNavigate();

    const [obras, setObras] = useState([]);
    const [mensajeError, setMensajeError] = useState();
    const [reporteCompleto, setReporteCompleto] = useState(false);

    const generarReporte = async (data) => {
        try {
            const updatedData = { ...data, completo: reporteCompleto };

            let existsJornalesSinConfirmar = false;
            for (const obraId of updatedData.obras) {
                const response = await JornalService.existsJornalesSinConfirmarByObraFecha(obraId, updatedData.fechaDesde, updatedData.fechaHasta);
                existsJornalesSinConfirmar = response.data;
                if (existsJornalesSinConfirmar) break;
            }

            if (existsJornalesSinConfirmar) {
                setMensajeError(`Existen jornales sin confirmar dentro de las fechas ${data.fechaDesde} al ${data.fechaHasta}.`);
                return;
            }

            const response = await ReporteService.getReporteEntreFechas(updatedData);

            // Crear URL para el Blob
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `jornales_${data.fechaDesde}_al_${data.fechaHasta}.xlsx`); // Nombre del archivo por defecto
            document.body.appendChild(link);
            link.click();

            // Limpiar
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            if (error.response && error.response.data instanceof Blob) {
                const errorText = await error.response.data.text();
                setMensajeError(errorText); // Mostrar mensaje de error si la respuesta es un Blob
            } else {
                setMensajeError(error.response?.data || "Error desconocido"); // Manejar otros errores
            }
        }
    };

    const fetchObrasActivasEntreFechas = async (fechaDesde, fechaHasta) => {
        try {
            const obrasData = await ObraService.getObrasActivasEntreFechas(fechaDesde, fechaHasta);
            setObras(obrasData.data);
        } catch (error) {
            setMensajeError(error.response.data);
        }
    };

    const handleCancelar = () => {
        navigate('/');
    }


    const handleAlertCloseError = (e) => {
        e.preventDefault();
        setMensajeError()
    }


    return (
        <div className='d-flex justify-content-center align-items-center mt-3 row'>
            <JornalFinderFormComponent
                titleFromParent={'Generar reporte'}
                obrasFromParent={obras}
                showTrabajadores={true}
                onSubmitDataToParent={generarReporte}
                onFechasChange={fetchObrasActivasEntreFechas}
                onCancelar={handleCancelar}
            />

            <button
                className={`btn btn-outline-dark col-md-2 my-3 mx-1 ${reporteCompleto ? 'btn-active-dark' : 'btn-inactive-dark'}`}
                onClick={(e) => { e.preventDefault(); setReporteCompleto(prevState => !prevState); }}>
                Completo
            </button>

            {mensajeError && <ErrorMessage mensajeError={mensajeError} handleAlertClose={(e) => handleAlertCloseError(e)} />}
        </div>

    );
};

export default GenerarReporteComponent;









