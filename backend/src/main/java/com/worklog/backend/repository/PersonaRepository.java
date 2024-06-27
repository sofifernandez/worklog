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

    @Query(value = "SELECT p.* FROM Persona p " +
            "INNER JOIN PERSONA_ROL pr ON pr.persona_id=p.id " +
            "WHERE p.activo=true AND pr.rol_id = 3", nativeQuery = true)
    Optional<Persona[]> getAllTrabajadoresActivos();
}
