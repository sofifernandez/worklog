package com.worklog.backend.repository;

import com.worklog.backend.model.Jornal;
import com.worklog.backend.model.Persona;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface JornalRepository extends JpaRepository<Jornal,Long>, JornalRepositoryCustom{

    Optional<Jornal[]> findByPersona (Persona persona);

    @Query("SELECT j FROM Jornal j WHERE j.persona = :persona ORDER BY j.fechaJornal DESC")
    Optional<Jornal[]> findByPersonaOrderedByFechaJornalDesc(@Param("persona") Persona persona);

}
