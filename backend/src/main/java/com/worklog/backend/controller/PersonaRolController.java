package com.worklog.backend.controller;

import com.worklog.backend.exception.PersonaRolNotFoundException;
import com.worklog.backend.model.PersonaRol;
import com.worklog.backend.repository.PersonaRolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("http://localhost:3000")
public class PersonaRolController {

    @Autowired
    PersonaRolRepository personaRolRepository;

    @PostMapping("/personaRol")
    PersonaRol newPersonaRol(@RequestBody PersonaRol newPersonaRol) {
        return personaRolRepository.save(newPersonaRol);
    }

    @GetMapping("/personaRoles")
    List<PersonaRol> getAllPersonaRol() {
        return personaRolRepository.findAll();
    }

    @GetMapping("/personaRol/{id}")
    PersonaRol getPersonaRolById(@PathVariable Long id) {
        return personaRolRepository.findById(id)
                .orElseThrow(() -> new PersonaRolNotFoundException(id));
    }

    @PutMapping("/personaRol/{id}")
    PersonaRol updatePersonaRol(@RequestBody PersonaRol newPersonaRol, @PathVariable Long id) {
        return personaRolRepository.findById(id)
                .map(persona -> {
                    persona.setRol(newPersonaRol.getRol());
                    persona.setPersona(newPersonaRol.getPersona());
                    persona.setFechaAlta(newPersonaRol.getFechaAlta());
                    persona.setFechaModif(newPersonaRol.getFechaModif());
                    persona.setActivo(newPersonaRol.getActivo());
                    return personaRolRepository.save(persona);
                }).orElseThrow(() -> new PersonaRolNotFoundException(id));
    }

    @DeleteMapping("/personaRol/{id}")
    String deletePersonaRol(@PathVariable Long id){
        if(!personaRolRepository.existsById(id)){
            throw new PersonaRolNotFoundException(id);
        }
        personaRolRepository.deleteById(id);
        return  "PersonaRol with id "+id+" has been deleted success.";
    }
}
