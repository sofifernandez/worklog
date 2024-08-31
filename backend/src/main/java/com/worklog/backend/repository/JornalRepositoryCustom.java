package com.worklog.backend.repository;

import com.worklog.backend.model.Jornal;
import com.worklog.backend.model.Obra;
import com.worklog.backend.model.Persona;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface JornalRepositoryCustom {
    Optional<Jornal[]> findJornalesByRangoDeFechasObraPersona(LocalDate startDate, LocalDate endDate, Obra obra, Persona persona);
    Optional<Jornal[]> findJornalesByFechaObraPersona (LocalDate fecha, Obra obra, Persona persona);
    Optional<Jornal[]> findJornalesByFechaObraPersonaConfirmados (LocalDate fecha, Obra obra, Persona persona);
    Optional<Jornal[]> findJornalesByFechasObrasyPersonas (LocalDate startDate, LocalDate endDate, List<Long> obrasID, List<Long> personasID);

}
