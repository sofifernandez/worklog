package com.worklog.backend.repository;

import com.worklog.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario,Long> {

    Optional<Usuario> findByUsername (String username);

    Optional<Usuario> findByPersonaId (long personaId);

    Boolean existsByUsername(String username);

}
