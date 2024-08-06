package com.worklog.backend.dto;

import com.worklog.backend.exception.InvalidDataException;
import com.worklog.backend.util.DateTimeUtil;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Setter
@Getter
public class ExportRequestDTO {
    private String fechaDesde;
    private String fechaHasta;
    private List<Long> obras;
    private List<Long> personas;

    public void validateData(){
        if (fechaDesde == null || fechaDesde.isBlank())
            throw new InvalidDataException("Por favor seleccione la fecha DESDE");
        if (fechaHasta == null || fechaHasta.isBlank())
            throw new InvalidDataException("Por favor seleccione la fecha HASTA");
        if(obras==null || obras.isEmpty())
            throw new InvalidDataException("Por favor selecciona al menos una obra");
        if(personas == null || personas.isEmpty())
            throw new InvalidDataException("Por favor selecciona al menos una persona");
        LocalDate startDate = LocalDate.parse(fechaDesde);
        LocalDate endDate = LocalDate.parse(fechaHasta);
        DateTimeUtil.validateFechas(startDate, endDate);
        DateTimeUtil.areDatesWithinSixMonths(startDate, endDate);
    }
}
