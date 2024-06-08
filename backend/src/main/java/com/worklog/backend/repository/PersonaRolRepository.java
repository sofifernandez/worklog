package com.worklog.backend.repository;

import com.worklog.backend.model.Persona;
import com.worklog.backend.model.PersonaRol;
import com.worklog.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PersonaRolRepository extends JpaRepository<PersonaRol,Long> {

    Optional<PersonaRol> findByPersona (Persona persona);

}
