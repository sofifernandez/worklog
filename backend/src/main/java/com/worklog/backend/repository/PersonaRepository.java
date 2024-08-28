package com.worklog.backend.repository;

import com.worklog.backend.model.Persona;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PersonaRepository extends JpaRepository<Persona,Long> {

    Optional<Persona> findByCi(String ci);

    @Query(value = "SELECT p.* FROM persona p JOIN usuario u ON p.id = u.persona_id WHERE u.username = :username", nativeQuery = true)
    Persona findPersonaByUsername(@Param("username") String username);

    @Query(value = "SELECT p.* FROM persona p " +
            "INNER JOIN persona_rol pr ON pr.persona_id=p.id " +
            "WHERE p.activo=true AND pr.rol_id = 3", nativeQuery = true)
    Optional<Persona[]> getAllTrabajadoresActivos();

    @Query(value = "SELECT p.* FROM persona p " +
            "INNER JOIN persona_rol pr ON pr.persona_id=p.id " +
            "WHERE p.activo=true", nativeQuery = true)
    Optional<Persona[]> getAllPersonasActivos();

    @Query(value= "SELECT P FROM Persona P WHERE P.nombre LIKE :nombre AND P.apellido LIKE :apellido")
    List<Persona> getPersonasByNombreyApellido(@Param("nombre") String nombre, @Param("apellido") String apellido);

    @Query(value= "SELECT P FROM Persona P WHERE P.nombre LIKE :nombrePattern OR P.apellido LIKE :nombrePattern")
    List<Persona> getPersonasByNombreOApellido(@Param("nombrePattern") String nombrePattern);

}
