package com.worklog.backend.controller;

import com.worklog.backend.exception.PersonaNotFoundException;
import com.worklog.backend.model.Jornal;
import com.worklog.backend.model.Persona;
import com.worklog.backend.service.JornalService;
import com.worklog.backend.service.PersonaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.WebRequest;
import java.util.List;
import java.util.Optional;

@RestController
public class PersonaController {

    @Autowired
    private PersonaService personaService;

    @Autowired
    private JornalService jornalService;

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
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<List<Persona>> getAllPersonas() {
        List<Persona> personas = personaService.getAllPersonas();
        return new ResponseEntity<>(personas, HttpStatus.OK);
    }

    @GetMapping("/persona/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Persona> getPersonaById(@PathVariable Long id) {
        Persona persona = personaService.getPersonaById(id);
        return new ResponseEntity<>(persona, HttpStatus.OK);
    }

    @PutMapping("/persona/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Object> updatePersona(@Valid @RequestBody Persona newPersona, @PathVariable Long id) {
        Persona updatedPersona = personaService.updatePersona(newPersona, id);
        return new ResponseEntity<>(updatedPersona, HttpStatus.OK);
    }

    @DeleteMapping("/persona/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<String> deletePersona(@PathVariable Long id) {
        personaService.deletePersona(id);
        return new ResponseEntity<>("Persona with id " + id + " has been deleted successfully.", HttpStatus.OK);
    }

    @GetMapping("/persona/getPersonasByNombre/{nombre}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'JEFE_OBRA')")
    public ResponseEntity< List<Persona>> getPersonasByNombre(@PathVariable String nombre) {
        List<Persona> personas = personaService.getPersonasByNombre(nombre);
        return new ResponseEntity<>(personas, HttpStatus.OK);
    }

    @GetMapping("/persona/findByUsername/{username}")
    public ResponseEntity<Persona> findPersonaByUsername(@PathVariable String username) {
        Persona persona = personaService.findPersonaByUsername(username);
        return new ResponseEntity<>(persona, HttpStatus.OK);
    }

    @GetMapping("/persona/getAllTrabajadoresActivos")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'JEFE_OBRA')")
    public ResponseEntity<Optional<Persona[]>> getAllTrabajadoresActivos() {
        Optional<Persona[]> personas = personaService.getAllTrabajadoresActivos();
        return new ResponseEntity<>(personas, HttpStatus.OK);
    }

    @GetMapping("/persona/getAllTrabajadoresDeObra/{obraId}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'JEFE_OBRA')")
    public ResponseEntity<List<Persona>> getAllTrabajadoresDeObra(@PathVariable Long obraId) {
        List<Persona> personas = jornalService.getAllTrabajadoresDeObra(obraId);
        return new ResponseEntity<>(personas, HttpStatus.OK);
    }

    @GetMapping("/persona/getTrabajadoresDeObraPorFecha/")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'JEFE_OBRA')")
    public ResponseEntity<List<Persona>> getTrabajadoresDeObraPorFecha(
            @RequestParam Long obraId,
            @RequestParam String fecha) {
        List<Persona> personas = jornalService.getTrabajadoresByObraAndFecha(obraId,fecha );
        return new ResponseEntity<>(personas, HttpStatus.OK);
    }

    @GetMapping("/persona/findByCI/{ci}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'JEFE_OBRA')")
    public ResponseEntity<Persona> findPersonaByCi(@PathVariable String ci) {
        Persona persona = personaService.findPersonaByCi(ci);
        return new ResponseEntity<>(persona, HttpStatus.OK);
    }


}
