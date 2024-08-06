
import ReporteService from "../services/ReporteService";
import React, { useState } from 'react'

const GenerarReporteComponent = () => {
    const [contenidoButton, setConenidoButton] = useState('');

    const generarReporte= async()=> {
        try {
            const exportReq = { fechaDesde: '2024-07-09', fechaHasta:'2024-07-17', obras:[0], personas:[0] }
            console.log(exportReq)
            const response = await ReporteService.getReporteEntreFechas(exportReq);
            console.log(response)
            // Create a URL for the Blob data
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'jornal_data.xlsx'); // Default file name
            document.body.appendChild(link);
            link.click();

            // Clean up
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <div>
           <div className="btn btn-info" onClick={generarReporte}>Generar reporte</div>
        </div>

    );
};

export default GenerarReporteComponent;









