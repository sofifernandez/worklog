package com.worklog.backend.controller;

import com.worklog.backend.exception.UsuarioNotFoundException;
import com.worklog.backend.model.Usuario;
import com.worklog.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("http://localhost:3000")
public class UsuarioController {


    @Autowired
    UsuarioRepository usuarioRepository;

    @PostMapping("/usuario")
    Usuario newUsuario(@RequestBody Usuario newUsuario) {
        return usuarioRepository.save(newUsuario);
    }

    @GetMapping("/usuarios")
    List<Usuario> getAllUsuario() {
        return usuarioRepository.findAll();
    }

    @GetMapping("/usuario/{id}")
    Usuario getUsuarioById(@PathVariable Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new UsuarioNotFoundException(id));
    }

    @PutMapping("/usuario/{id}")
    Usuario updateUsuario(@RequestBody Usuario newUsuario, @PathVariable Long id) {
        return usuarioRepository.findById(id)
                .map(usuario -> {
                    usuario.setPersona(newUsuario.getPersona());;
                    usuario.setUsername(newUsuario.getUsername());
                    usuario.setPassword(newUsuario.getPassword());
                    return usuarioRepository.save(usuario);
                }).orElseThrow(() -> new UsuarioNotFoundException(id));
    }

    @DeleteMapping("/usuario/{id}")
    String deleteUsuario(@PathVariable Long id){
        if(!usuarioRepository.existsById(id)){
            throw new UsuarioNotFoundException(id);
        }
        usuarioRepository.deleteById(id);
        return  "Usuario with id "+id+" has been deleted successfully.";
    }
    
}
