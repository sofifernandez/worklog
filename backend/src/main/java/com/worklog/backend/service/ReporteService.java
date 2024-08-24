package com.worklog.backend.service;

import com.worklog.backend.dto.DetalleHorasJornalDTO;
import com.worklog.backend.dto.JornalDataRequestDTO;
import com.worklog.backend.exception.InvalidDataException;
import com.worklog.backend.model.*;
import com.worklog.backend.repository.JornalRepository;
import com.worklog.backend.util.DateTimeUtil;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;


@Service
public class ReporteService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private JornalService jornalService;
    @Autowired
    private ObraService obraService;
    @Autowired
    private JornalRepository jornalRepository;
    @Autowired
    private PersonaService personaService;
    @Autowired
    private ModificacionService modificacionService;

    public byte[] exportToExcel(List<DetalleHorasJornalDTO> jornalDataList, List<Modificacion> modificaciones) throws IOException {
        XSSFWorkbook workbook = new XSSFWorkbook();

        // Group the data by Obra
        Map<Obra, List<DetalleHorasJornalDTO>> groupedByObra = jornalDataList.stream()
                .collect(Collectors.groupingBy(DetalleHorasJornalDTO::getObra));

        for (Map.Entry<Obra, List<DetalleHorasJornalDTO>> entry : groupedByObra.entrySet()) {
            Obra obra = entry.getKey();
            List<DetalleHorasJornalDTO> obraJornalDataList = entry.getValue();

            // Create a new sheet for each Obra
            XSSFSheet sheet = workbook.createSheet(obra.getNombre());

            // Create header row
            Row headerRow = sheet.createRow(0);
            String[] headers = {"Apellido", "Nombre", "Obra", "Fecha", "Horas Comunes", "Horas Lluvia", "Horas Extra"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(createHeaderCellStyle(workbook));
            }

            // Populate the sheet with data
            int rowNum = 1;
            for (DetalleHorasJornalDTO data : obraJornalDataList) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(data.getPersona().getApellido());
                row.createCell(1).setCellValue(data.getPersona().getNombre());
                row.createCell(2).setCellValue(data.getObra().getNombre());
                row.createCell(3).setCellValue(data.getFechaJornal().toString());
                row.createCell(4).setCellValue(data.getHorasComun());
                row.createCell(5).setCellValue(data.getHorasLluvia());
                row.createCell(6).setCellValue(data.getHorasExtra());
            }

            // Adjust column widths
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }
        }


        if(modificaciones !=null && !modificaciones.isEmpty()){
            // Add a new sheet for Modificacion data
            XSSFSheet modificacionSheet = workbook.createSheet("Modificaciones");

            // Create header row for Modificaciones
            Row modificacionHeaderRow = modificacionSheet.createRow(0);
            String[] modificacionHeaders = {"Fecha del jornal", "Obra", "Trabajador",
                    "Fecha modificacion", "Campo","Valor anterior", "Valor actualzado", "Responsable", "Motivo"};
            for (int i = 0; i < modificacionHeaders.length; i++) {
                Cell cell = modificacionHeaderRow.createCell(i);
                cell.setCellValue(modificacionHeaders[i]);
                cell.setCellStyle(createHeaderCellStyle(workbook));
            }

            // Populate the Modificacion sheet with data
            int modificacionRowNum = 1;
            for (Modificacion modificacion : modificaciones) {
                Row row = modificacionSheet.createRow(modificacionRowNum++);
                row.createCell(0).setCellValue(modificacion.getJornal().getFechaJornal()); // Adjust based on your Modificacion fields
                row.createCell(1).setCellValue(modificacion.getJornal().getObra().getNombre());
                row.createCell(2).setCellValue(modificacion.getJornal().getPersona().getApellido() + (modificacion.getJornal().getPersona().getNombre()));
                row.createCell(3).setCellValue(modificacion.getFechaModificacion());
                row.createCell(4).setCellValue(modificacion.getCampoModificado());
                row.createCell(5).setCellValue(modificacion.getValorAnterior());
                row.createCell(6).setCellValue(modificacion.getValorActual());
                row.createCell(7).setCellValue(modificacion.getResponsable().getApellido());
                row.createCell(8).setCellValue(modificacion.getMotivo());
            }

            // Adjust column widths for Modificacion sheet
            for (int i = 0; i < modificacionHeaders.length; i++) {
                modificacionSheet.autoSizeColumn(i);
            }

        }



        // Write the output to a byte array
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            workbook.write(out);
            return out.toByteArray();
        } finally {
            workbook.close();
        }
    }

    private CellStyle createHeaderCellStyle(Workbook workbook) {
        CellStyle cellStyle = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        cellStyle.setFont(font);
        return cellStyle;
    }

    public List<DetalleHorasJornalDTO> fetchDataForExport(JornalDataRequestDTO exportRequest) {
        exportRequest.validateData();

        LocalDate fechaDesde = LocalDate.parse(exportRequest.getFechaDesde());
        LocalDate fechaHasta = LocalDate.parse(exportRequest.getFechaHasta());
        List<Long> obrasSeleccionadas = exportRequest.getObras();
        List<Long> personasSeleccionadas = exportRequest.getPersonas();

        boolean allActiveObras = obrasSeleccionadas.size()==1 && obrasSeleccionadas.getFirst().equals(0L);
        boolean allActiveTrabajadores= personasSeleccionadas.size()==1 && personasSeleccionadas.getFirst().equals(0L);

        List<DetalleHorasJornalDTO> jornalDetalles = new ArrayList<>();
        List<Obra> obras;
        List<Persona> someTrabajadores=null;

        if(allActiveObras){
            obras = jornalService.getAllObrasByDates(fechaDesde,fechaHasta);
            List<Long> ids = obras.stream()
                    .map(Obra::getId)
                    .toList();
            exportRequest.setObras(ids);
        } else {
            obras= obraService.getObrasByIds(obrasSeleccionadas);
        }
        if(!allActiveTrabajadores){
            someTrabajadores=personaService.getPersonasByIds(personasSeleccionadas);
        }

        for(Obra o : obras){
            List<Persona> trabajadoresDeObra;
            if(!allActiveTrabajadores) {
                trabajadoresDeObra = someTrabajadores;
            } else {
                trabajadoresDeObra= jornalService.getAllTrabajadoresDeObraByDates(o, fechaDesde, fechaHasta);
            }
            List<DetalleHorasJornalDTO> jornalDetallesPorObra = this.generarDetallesDeTrabajadoresPorObra(o,trabajadoresDeObra, fechaDesde, fechaHasta);
            jornalDetalles.addAll(jornalDetallesPorObra);
        }

        if(jornalDetalles.isEmpty()) throw new InvalidDataException("No existen jornales para los parámetros ingresados");
        return jornalDetalles; // Return an empty list if no data is found
    }

    private List<DetalleHorasJornalDTO> generarDetallesDeTrabajadoresPorObra (Obra obra, List<Persona> trabajadores, LocalDate startDate, LocalDate endDate) {
        List<DetalleHorasJornalDTO> jornalDetalles = new ArrayList<>();

        for (Persona persona : trabajadores) {
            LocalDate currentDate = startDate;
            while (!currentDate.isAfter(endDate)) {
                Optional<Jornal[]> jornales= jornalRepository.findJornalesByFechaObraPersona(currentDate, obra, persona);
                List<Jornal> jornalesList = jornalService.convertOptionalArrayToList(jornales);
                if(!jornalesList.isEmpty()) {
                    DetalleHorasJornalDTO detalleHorasJornalDTO = this.getDetalleHorasFromJornalesPorDia(jornalesList);
                    jornalDetalles.add(detalleHorasJornalDTO);
                }
                currentDate = currentDate.plusDays(1);
            }
        }
        return jornalDetalles;
    }

    private DetalleHorasJornalDTO getDetalleHorasFromJornalesPorDia(List<Jornal> jornalList){
        Map<Boolean, List<Jornal>> partitionedJornalesComun = jornalList.stream()
                .collect(Collectors.partitioningBy(jornal -> jornal.getTipoJornal().getId().equals(TipoJornal.ID_JORNAL_COMUN)));
        Map<Boolean, List<Jornal>> partitionedJornalesLluvia = jornalList.stream()
                .collect(Collectors.partitioningBy(jornal -> jornal.getTipoJornal().getId().equals(TipoJornal.ID_JORNAL_LLUVIA)));
        Map<Boolean, List<Jornal>> partitionedJornalesExtra = jornalList.stream()
                .collect(Collectors.partitioningBy(jornal -> jornal.getTipoJornal().getId().equals(TipoJornal.ID_JORNAL_EXTRA)));
        List<Jornal> jornalesComunes = partitionedJornalesComun.get(true);
        List<Jornal> jornalesLluvia = partitionedJornalesLluvia.get(true);
        List<Jornal> jornalesExtra = partitionedJornalesExtra.get(true);
        double totalHorasComunes= calcularTotalHoras(jornalesComunes);
        double totalHorasLLuvia =calcularTotalHoras(jornalesLluvia);
        double totalHorasExtra= calcularTotalHoras(jornalesExtra);

        return getDetalleHorasJornalDTO(jornalList, totalHorasComunes, totalHorasLLuvia, totalHorasExtra);
    }

    private static DetalleHorasJornalDTO getDetalleHorasJornalDTO(List<Jornal> jornalList, double totalHorasComunes, double totalHorasLLuvia, double totalHorasExtra) {
        DetalleHorasJornalDTO detalleHorasJornalDTO = new DetalleHorasJornalDTO();
        detalleHorasJornalDTO.setPersona(jornalList.getFirst().getPersona());
        detalleHorasJornalDTO.setObra(jornalList.getFirst().getObra());
        detalleHorasJornalDTO.setFechaJornal(jornalList.getFirst().getFechaJornal());
        detalleHorasJornalDTO.setHorasComun(totalHorasComunes);
        detalleHorasJornalDTO.setHorasLluvia(totalHorasLLuvia);
        detalleHorasJornalDTO.setHorasExtra(totalHorasExtra);
        detalleHorasJornalDTO.transformarHoras();
        return detalleHorasJornalDTO;
    }

    private double calcularTotalHoras (List<Jornal> jornales) {
        double total=0;
        for(Jornal j: jornales){
            if(j.getHoraComienzo()!=null & j.getHoraFin()!=null){ //Para que no de NullPointer si está sin terminar
                total+= DateTimeUtil.calculateHoursDifference(j.getHoraComienzo(),j.getHoraFin());
            }
        }
        return total;
    }

    public List<Modificacion> getModificacionesByFechasAndObras(JornalDataRequestDTO expReq){
        List<Modificacion> mod=null;
        LocalDate fechaDesde = LocalDate.parse(expReq.getFechaDesde());
        LocalDate fechaHasta = LocalDate.parse(expReq.getFechaHasta());

        if(expReq.isCompleto()){
            mod= modificacionService.getModificacionesByFechasAndObras(fechaDesde,fechaHasta, expReq.getObras());
        }
         return mod;
    }



}
