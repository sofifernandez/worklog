package com.worklog.backend.service;

import com.worklog.backend.exception.InvalidDataException;
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
            usuario.setPasswordResetRequired(true);
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
    public void changePassword(long id, String password) {
        if(!isValidPassword(password)) {
            throw new InvalidDataException("La contraseña debe tener al menos 8 caracteres");
        }
        Usuario usuario = usuarioRepository.findByPersonaId(id).orElse(null);
        if (usuario == null) {
            throw new UsuarioNotFoundException(id);
        }
        if(isCedulaPassword(password,usuario.getPersona().getCi())) {
            throw new InvalidDataException("La contraseña debe ser distinta de la cédula");
        }
        usuario.setPassword(new BCryptPasswordEncoder().encode(password));
        usuario.setPasswordResetRequired(false);
        usuarioRepository.save(usuario);
    }

    private boolean isValidPassword(String password) {
        return password.length() >= 8;
    }

    private boolean isCedulaPassword(String password, String cedula) {
        return password.equals(cedula);
    }
}
