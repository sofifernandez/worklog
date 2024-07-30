package com.worklog.backend.service;

import com.worklog.backend.exception.UsuarioNotFoundException;
import com.worklog.backend.model.Persona;
import com.worklog.backend.model.Usuario;
import com.worklog.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Transactional
    public Usuario newUsuario(Persona persona) {
        try {
            if(usuarioRepository.existsByUsername(persona.getCi())) {
                throw new Exception("El usuario ya existe");
            }
            Usuario usuario = new Usuario();
            usuario.setPersona(persona);
            usuario.setUsername(persona.getCi());
            usuario.setPasswordResetRequired(false);
            usuario.setPassword(new BCryptPasswordEncoder().encode(persona.getCi()));
            return usuarioRepository.save(usuario);
        } catch (Exception e) {
            // Handle the exception, e.g., log it and/or rethrow it as a custom exception
            System.err.println("An error occurred while saving the Usuario: " + e.getMessage());
            // You can also log the stack trace for more detailed error information
            e.printStackTrace();

            // Optionally, rethrow the exception or return a default/fallback value
            // throw new CustomException("Failed to save Persona", e);
            return null; // or you might choose to return a default Persona object or handle it in another way
        }
    }

    @Transactional(readOnly = true)
    public boolean firstLogin(long id) {
        Usuario usuario = usuarioRepository.findByPersonaId(id).orElseThrow(() ->
                new UsuarioNotFoundException(id));
        return usuario.isPasswordResetRequired();
    }

    @Transactional
    public ResponseEntity<String> changePassword(long id, String password) {
        if(!isValidPassword(password)) {
            return ResponseEntity.badRequest().body("La contraseña debe tener al menos 4 caracteres");
        }
        Usuario usuario = usuarioRepository.findByPersonaId(id).orElse(null);
        if (usuario == null) {
            throw new UsuarioNotFoundException(id);
        }
        usuario.setPassword(new BCryptPasswordEncoder().encode(password));
        usuario.setPasswordResetRequired(false);
        usuarioRepository.save(usuario);
        return ResponseEntity.ok("Contraseña cambiada exitosamente.");
    }

    private boolean isValidPassword(String password) {
        return password.length() >= 4;
    }
}
