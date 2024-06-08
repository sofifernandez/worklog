package com.worklog.backend.controller;

import com.worklog.backend.exception.PersonaNotFoundException;
import com.worklog.backend.model.Persona;
import com.worklog.backend.service.PersonaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.WebRequest;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin("http://localhost:3000")
//@CrossOrigin("http://100.28.58.113:8081")
public class PersonaController {

    @Autowired
    private PersonaService personaService;

    @ExceptionHandler(PersonaNotFoundException.class)
    public ResponseEntity<String> handlePersonaNotFoundException(PersonaNotFoundException ex, WebRequest request) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @PostMapping("/persona")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Object> newPersona(@Valid @RequestBody Persona newPersona) {
        Persona savedPersona = personaService.savePersona(newPersona);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedPersona);
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
    public ResponseEntity<Object> updatePersona(@Valid @RequestBody Persona newPersona, @PathVariable Long id) {
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

   /* private ResponseEntity<Object> getValidationErrors(BindingResult result) {
        if (result.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            for (FieldError error : result.getFieldErrors()) {
                errors.put(error.getField(), error.getDefaultMessage());
            }
            return ResponseEntity.badRequest().body(errors);
        }
        return null;
    }*/



}
