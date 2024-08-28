package com.worklog.backend.controller;

import com.worklog.backend.dto.DetalleHorasJornalDTO;
import com.worklog.backend.dto.DetalleJornalGeneralDTO;
import com.worklog.backend.dto.JornalDataRequestDTO;
import com.worklog.backend.model.Modificacion;
import com.worklog.backend.service.ReporteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;


@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class ReporteController {

    private final ReporteService reporteService;

    @Autowired
    public ReporteController(ReporteService reporteService) {
        this.reporteService = reporteService;
    }


    @PostMapping("/reporte")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<byte[]> exportToExcel(
            @RequestBody JornalDataRequestDTO exportRequest) throws IOException {
        // Fetch the data for the Excel export
        List<DetalleHorasJornalDTO> jornalDataList = reporteService.fetchDataForExport(exportRequest);
        List<Modificacion> modificaciones = reporteService.getModificacionesByFechasAndObras(exportRequest);
        List<DetalleJornalGeneralDTO> general = reporteService.getJornalGeneralByFechas(exportRequest);

        // Generate Excel content
        byte[] excelContent = reporteService.exportToExcel(jornalDataList, modificaciones, general);

        // Set headers for file download
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment", "jornal_data.xlsx");

        // Return the response entity with the byte array of the Excel file
        return new ResponseEntity<>(excelContent, headers, HttpStatus.OK);
    }



}

