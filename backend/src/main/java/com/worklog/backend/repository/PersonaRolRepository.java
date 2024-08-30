package com.worklog.backend.repository;

import com.worklog.backend.model.Persona;
import com.worklog.backend.model.PersonaRol;
import com.worklog.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface PersonaRolRepository extends JpaRepository<PersonaRol,Long> {

    Optional<PersonaRol> findByPersona (Persona persona);

    @Query(value = "SELECT CASE WHEN COUNT(*) > 0 THEN 1 ELSE 0 END FROM persona_rol pr WHERE pr.persona_id = :personaId AND pr.rol_id = :rolId AND pr.activo = true", nativeQuery = true)
    int existsByPersonaIdAndRolIdAndActivo(@Param("personaId") Long personaId, @Param("rolId") Long rolId);

    @Query("SELECT pr FROM PersonaRol pr, Usuario u, Persona p WHERE pr.persona=u.persona AND u.username = :username AND pr.activo = true")
    Optional<PersonaRol> findPersonaRolActivoByUsername(@Param("username") String username);



}
