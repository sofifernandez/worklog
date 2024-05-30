package com.worklog.backend.controller;


import com.worklog.backend.exception.PersonaNotFoundException;
import com.worklog.backend.model.Persona;
import com.worklog.backend.service.PersonaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.WebRequest;

import java.util.List;

@RestController
@CrossOrigin("http://localhost:3000")
public class PersonaController {

    @Autowired
    private PersonaService personaService;

    @ExceptionHandler(PersonaNotFoundException.class)
    public ResponseEntity<String> handlePersonaNotFoundException(PersonaNotFoundException ex, WebRequest request) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @PostMapping("/persona")
    public ResponseEntity<Persona> newPersona(@RequestBody Persona newPersona) {
        Persona savedPersona = personaService.savePersona(newPersona);
        return new ResponseEntity<>(savedPersona, HttpStatus.CREATED);
    }

    @GetMapping("/personas")
    public ResponseEntity<List<Persona>> getAllPersonas() {
        List<Persona> personas = personaService.getAllPersonas();
        return new ResponseEntity<>(personas, HttpStatus.OK);
    }

    @GetMapping("/persona/{id}")
    public ResponseEntity<Persona> getPersonaById(@PathVariable Long id) {
        Persona persona = personaService.getPersonaById(id);
        return new ResponseEntity<>(persona, HttpStatus.OK);
    }

    @PutMapping("/persona/{id}")
    public ResponseEntity<Persona> updatePersona(@RequestBody Persona newPersona, @PathVariable Long id) {
        Persona updatedPersona = personaService.updatePersona(newPersona, id);
        return new ResponseEntity<>(updatedPersona, HttpStatus.OK);
    }

    @DeleteMapping("/persona/{id}")
    public ResponseEntity<String> deletePersona(@PathVariable Long id) {
        personaService.deletePersona(id);
        return new ResponseEntity<>("Persona with id " + id + " has been deleted successfully.", HttpStatus.OK);
    }

    @GetMapping("/persona/searchByCI/{ci}")
    public ResponseEntity<Persona> findPersonaByCi(@PathVariable String ci) {
        Persona persona = personaService.findPersonaByCi(ci);
        return new ResponseEntity<>(persona, HttpStatus.OK);
    }



}
