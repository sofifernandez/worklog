package com.worklog.backend.repository;

import com.worklog.backend.model.Jornal;
import com.worklog.backend.model.Obra;
import com.worklog.backend.model.Persona;
import com.worklog.backend.model.TipoJornal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Timestamp;
import java.time.LocalDate;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

public interface JornalRepository extends JpaRepository<Jornal,Long>, JornalRepositoryCustom{

    Optional<Jornal[]> findByPersona (Persona persona);

    Optional<Jornal[]> findByFechaJornal (LocalDate fechaJornal);

    Optional<Jornal[]> findByPersonaAndObraAndFechaJornalOrderByFechaJornalDesc (Persona persona, Obra obra, LocalDate fechaJornal);

    Optional<Jornal[]> findByFechaJornalAndObraAndPersonaAndTipoJornal(LocalDate fechaJornal, Obra obra, Persona persona, TipoJornal tipoJornal);

    Optional<Jornal[]> findByFechaJornalAndPersonaAndTipoJornal(LocalDate fechaJornal, Persona persona, TipoJornal tipoJornal);

    Optional<Jornal[]> findByFechaJornalAndPersona(LocalDate fechaJornal, Persona persona);

    @Query("SELECT j FROM Jornal j WHERE j.persona = :persona ORDER BY j.fechaJornal DESC")
    Optional<Jornal[]> findByPersonaOrderedByFechaJornalDesc(@Param("persona") Persona persona);

    @Query(value = "SELECT DISTINCT J.persona FROM Jornal J WHERE J.obra=:obra")
    List<Persona> getAllTrabajadoresDeObra(@Param("obra") Obra obra);

    @Query(value = "SELECT DISTINCT J.persona FROM Jornal J WHERE J.obra=:obra AND J.fechaJornal = :fecha")
    List<Persona> getTrabajadoresByObraAndFecha(@Param("obra") Obra obra, @Param("fecha") LocalDate fecha);

    @Query("SELECT j FROM Jornal j WHERE j.persona = :persona AND j.fechaJornal = :fecha AND j.obra != :obra")
    Optional<Jornal[]> findByPersonaAndFechaAndNotObra(@Param("persona") Persona persona, @Param("fecha") LocalDate fecha, @Param("obra") Obra obra);


}
