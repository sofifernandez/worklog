package com.worklog.backend.service;

import com.worklog.backend.model.Persona;
import com.worklog.backend.model.Usuario;
import com.worklog.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.Date;

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
}
