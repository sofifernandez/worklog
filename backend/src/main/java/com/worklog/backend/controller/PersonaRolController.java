package com.worklog.backend.controller;

import com.worklog.backend.exception.PersonaRolNotFoundException;
import com.worklog.backend.model.Persona;
import com.worklog.backend.model.PersonaRol;
import com.worklog.backend.repository.PersonaRolRepository;
import com.worklog.backend.service.PersonaRolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.WebRequest;

import java.util.List;

@RestController
@CrossOrigin("http://localhost:3000")
//@CrossOrigin("http://100.28.58.113:3000")
public class PersonaRolController {

    @Autowired
    private PersonaRolService personaRolService;

    @ExceptionHandler(PersonaRolNotFoundException.class)
    public ResponseEntity<String> handlePersonaRolNotFoundException(PersonaRolNotFoundException ex, WebRequest request) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @PostMapping("/personaRol")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<PersonaRol> newPersonaRol(@RequestBody PersonaRol newPersonaRol) {
        PersonaRol savedPersonaRol = personaRolService.savePersonaRol(newPersonaRol);
        return new ResponseEntity<>(savedPersonaRol, HttpStatus.CREATED);
    }

    @GetMapping("/personaRoles")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<List<PersonaRol>> getAllPersonaRoles() {
        List<PersonaRol> personaRoles = personaRolService.getAllPersonaRoles();
        return new ResponseEntity<>(personaRoles, HttpStatus.OK);
    }

    @GetMapping("/personaRol/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<PersonaRol> getPersonaRolById(@PathVariable Long id) {
        PersonaRol personaRol = personaRolService.getPersonaRolById(id);
        return new ResponseEntity<>(personaRol, HttpStatus.OK);
    }

    @PutMapping("/personaRol/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<PersonaRol> updatePersonaRol(@RequestBody PersonaRol newPersonaRol, @PathVariable Long id) {
        PersonaRol updatedPersonaRol = personaRolService.updatePersonaRol(newPersonaRol, id);
        return new ResponseEntity<>(updatedPersonaRol, HttpStatus.OK);
    }

    @DeleteMapping("/personaRol/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<String> deletePersonaRol(@PathVariable Long id) {
        personaRolService.deletePersonaRol(id);
        return new ResponseEntity<>("PersonaRol with id " + id + " has been deleted successfully.", HttpStatus.OK);
    }

    @GetMapping("/personaRol/personasByRol/{rol}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<List<Persona>> getPersonasByRol(@PathVariable String rol) {
        List<Persona> personas = personaRolService.findPersonasByRol(rol);
        return new ResponseEntity<>(personas, HttpStatus.OK);
    }

    @GetMapping("/personaRol/personaRolByCI/{ci}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<PersonaRol> getPersonaRolActivoByCI(@PathVariable String ci) {
        PersonaRol personaRol = personaRolService.getPersonaRolActivoByCi(ci);
        return new ResponseEntity<>(personaRol, HttpStatus.OK);
    }

}
