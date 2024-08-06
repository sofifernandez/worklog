package com.worklog.backend.controller;

import com.worklog.backend.dto.DetalleHorasJornalDTO;
import com.worklog.backend.dto.ExportRequestDTO;
import com.worklog.backend.service.ReporteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletResponse;
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
    public void exportToExcel(
            @RequestBody ExportRequestDTO exportRequest,
            HttpServletResponse response) throws IOException {
        //TODO: cuando hay algún jornal sin finalizar da null pointer except
        List<DetalleHorasJornalDTO> jornalDataList = reporteService.fetchDataForExport(exportRequest);
        // Generate Excel content
        byte[] excelContent = reporteService.exportToExcel(jornalDataList);
        // Set response headers
        response.setContentType(MediaType.APPLICATION_OCTET_STREAM_VALUE);
        response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=jornal_data.xlsx");
        response.getOutputStream().write(excelContent);
        response.flushBuffer();
    }


}

