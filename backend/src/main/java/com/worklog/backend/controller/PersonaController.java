package com.worklog.backend.controller;

import com.worklog.backend.exception.PersonaNotFoundException;
import com.worklog.backend.model.Persona;
import com.worklog.backend.repository.PersonaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

@RestController
@CrossOrigin("http://localhost:3000")
//@CrossOrigin("http://100.28.58.113:8081")
public class PersonaController {

    @Autowired
    private PersonaRepository personaRepository;

    @PostMapping("/persona")
    Persona newPersona(@RequestBody Persona newPersona) {
        Timestamp currentTimestamp = new Timestamp(new Date().getTime());
        newPersona.setFechaAlta(currentTimestamp);
        newPersona.setFechaModif(currentTimestamp);
        return personaRepository.save(newPersona);
    }

    @GetMapping("/personas")
    List<Persona> getAllPersonas() {
        return personaRepository.findAll();
    }

    @GetMapping("/persona/{id}")
    Persona getPersonaById(@PathVariable Long id) {
        return personaRepository.findById(id)
                .orElseThrow(() -> new PersonaNotFoundException(id));
    }

    @PutMapping("/persona/{id}")
    Persona updatePersona(@RequestBody Persona newPersona, @PathVariable Long id) {
        Timestamp currentTimestamp = new Timestamp(new Date().getTime());
        newPersona.setFechaModif(currentTimestamp);
        return personaRepository.findById(id)
                .map(persona -> {
                    persona.setNombre(newPersona.getNombre());
                    persona.setApellido(newPersona.getApellido());
                    persona.setCi(newPersona.getCi());
                    persona.setFechaNacimiento(newPersona.getFechaNacimiento());
                    persona.setNumeroTelefono(newPersona.getNumeroTelefono());
                    persona.setFechaModif(newPersona.getFechaModif());
                    persona.setActivo(newPersona.getActivo());
                    return personaRepository.save(persona);
                }).orElseThrow(() -> new PersonaNotFoundException(id));
    }

    @DeleteMapping("/persona/{id}")
    String deletePersona(@PathVariable Long id){
        if(!personaRepository.existsById(id)){
            throw new PersonaNotFoundException(id);
        }
        personaRepository.deleteById(id);
        return  "Persona with id "+id+" has been deleted success.";
    }
}
