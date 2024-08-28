
import ReporteService from "../services/ReporteService";
import React, { useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css';
import ObraService from "../services/ObraService";
import JornalFinderFormComponent from "./functionalComponents/JornalFinderFormComponent";
import ErrorMessage from './functionalComponents/ErrorMessageComponent';

const GenerarReportePruebaComponent = () => {
    const [obras, setObras] = useState([]);
    const [mensajeError, setMensajeError] = useState();
    const [reporteCompleto, setReporteCompleto] =useState(false);


    const generarReporte = async (data) => {
        try {
            console.log(data)
            const updatedData = {...data, completo:reporteCompleto}
            console.log(updatedData)
            const response = await ReporteService.getReporteEntreFechas(updatedData);
            // Create a URL for the Blob data
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `jornales_${data.fechaDesde}_al_${data.fechaHasta}.xlsx`); // Default file name
            document.body.appendChild(link);
            link.click();

            // Clean up
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.log(error)
            if (error.response && error.response.data instanceof Blob) {
                // Handle Blob error response by converting it to text
                const errorText = await error.response.data.text();
                setMensajeError(errorText);  // Assuming `setMensajeError` is used for displaying the error message
            } else {
                // Handle non-Blob errors (network errors, etc.)
                setMensajeError(error.response.data);
            }

        }
    }

    const fetchObrasActivasEntreFechas = async (fechaDesde, fechaHasta) => {
        try {
            const obrasData = await ObraService.getObrasActivasEntreFechas(fechaDesde, fechaHasta);
            setObras(obrasData.data);
        } catch (error) {
            setMensajeError(error.response.data);
        }
    };


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

export default GenerarReportePruebaComponent;









