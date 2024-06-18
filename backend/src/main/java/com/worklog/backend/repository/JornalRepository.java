package com.worklog.backend.repository;

import com.worklog.backend.model.Jornal;
import com.worklog.backend.model.Persona;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface JornalRepository extends JpaRepository<Jornal,Long>{

    Optional<Jornal[]> findByPersona (Persona persona);

}
