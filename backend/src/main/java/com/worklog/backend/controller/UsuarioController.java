package com.worklog.backend.controller;

import com.worklog.backend.dto.PasswordUpadteDTO;
import com.worklog.backend.exception.UsuarioNotFoundException;
import com.worklog.backend.model.Usuario;
import com.worklog.backend.repository.UsuarioRepository;
import com.worklog.backend.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class UsuarioController {

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    UsuarioRepository usuarioRepository;

    @Autowired
    UsuarioService usuarioService;

    @PostMapping("/usuario")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    Usuario newUsuario(@RequestBody Usuario newUsuario) {
        newUsuario.setPassword(passwordEncoder.encode(newUsuario.getPassword()));
        return usuarioRepository.save(newUsuario);
    }

    @GetMapping("/usuarios")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    List<Usuario> getAllUsuario() {
        return usuarioRepository.findAll();
    }

    @GetMapping("/usuario/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    Usuario getUsuarioById(@PathVariable Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new UsuarioNotFoundException(id));
    }

    @PutMapping("/usuario/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    Usuario updateUsuario(@RequestBody Usuario newUsuario, @PathVariable Long id) {
        return usuarioRepository.findById(id)
                .map(usuario -> {
                    usuario.setPersona(newUsuario.getPersona());
                    usuario.setUsername(newUsuario.getUsername());
                    usuario.setPassword(passwordEncoder.encode(newUsuario.getPassword()));
                    return usuarioRepository.save(usuario);
                }).orElseThrow(() -> new UsuarioNotFoundException(id));
    }

    @DeleteMapping("/usuario/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    String deleteUsuario(@PathVariable Long id){
        if(!usuarioRepository.existsById(id)){
            throw new UsuarioNotFoundException(id);
        }
        usuarioRepository.deleteById(id);
        return  "Usuario with id "+id+" has been deleted successfully.";
    }

    @GetMapping("usuario/reset-password/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'JEFE_OBRA', 'TRABAJADOR')")
    boolean firstLogin(@PathVariable Long id){
        return usuarioService.firstLogin(id);
    }

    @PutMapping("usuario/new-password")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'JEFE_OBRA', 'TRABAJADOR')")
    public ResponseEntity<Object> updatePassword(@RequestBody PasswordUpadteDTO request) {
        long personaId = request.getPersonaId();
        String newPassword = request.getNewPassword();
        usuarioService.changePassword(personaId, newPassword);
        return ResponseEntity.ok().build();
    }
}
