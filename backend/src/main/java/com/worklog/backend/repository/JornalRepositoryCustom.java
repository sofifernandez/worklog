package com.worklog.backend.repository;

import com.worklog.backend.model.Jornal;
import com.worklog.backend.model.Obra;
import com.worklog.backend.model.Persona;

import java.sql.Timestamp;
import java.util.Optional;

public interface JornalRepositoryCustom {
    Optional<Jornal[]> findJornalesByFiltros(Timestamp startDate, Timestamp endDate, Obra obra, Persona persona);
    Optional<Jornal[]> findJornalesByFechaObraPersona (Timestamp fecha, Obra obra, Persona persona);
}
