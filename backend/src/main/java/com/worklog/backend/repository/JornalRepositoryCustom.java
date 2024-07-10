package com.worklog.backend.repository;

import com.worklog.backend.model.Jornal;
import com.worklog.backend.model.Obra;
import com.worklog.backend.model.Persona;

import java.time.LocalDate;
import java.util.Optional;

public interface JornalRepositoryCustom {
    Optional<Jornal[]> findJornalesByFiltros(LocalDate startDate, LocalDate endDate, Obra obra, Persona persona);
}
