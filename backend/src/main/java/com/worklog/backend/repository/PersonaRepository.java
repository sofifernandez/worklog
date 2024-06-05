package com.worklog.backend.repository;

import com.worklog.backend.model.Persona;
import com.worklog.backend.model.PersonaRol;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PersonaRepository extends JpaRepository<Persona,Long> {

    Optional<Persona> findByCi(String ci);
}
