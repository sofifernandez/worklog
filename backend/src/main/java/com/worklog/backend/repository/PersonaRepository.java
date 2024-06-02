package com.worklog.backend.repository;

import com.worklog.backend.model.Persona;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PersonaRepository extends JpaRepository<Persona,Long> {

}
