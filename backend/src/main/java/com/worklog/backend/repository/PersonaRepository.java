package com.worklog.backend.repository;

import com.worklog.backend.model.Persona;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface PersonaRepository extends JpaRepository<Persona,Long> {

    Optional<Persona> findByCi(String ci);

    @Query(value = "SELECT p.* FROM Persona p JOIN Usuario u ON p.id = u.persona_id WHERE u.username = :username", nativeQuery = true)
    Persona findPersonaByUsername(@Param("username") String username);
}
