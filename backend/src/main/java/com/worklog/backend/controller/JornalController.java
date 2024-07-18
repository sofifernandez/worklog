package com.worklog.backend.controller;

import com.worklog.backend.exception.JornalNotFoundException;
import com.worklog.backend.exception.JornalNotSavedException;
import com.worklog.backend.model.Jornal;
import com.worklog.backend.service.JornalService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.WebRequest;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class JornalController {

    @Autowired
    private JornalService jornalService;

    @ExceptionHandler(JornalNotFoundException.class)
    public ResponseEntity<String> handleJornalNotFoundException(JornalNotFoundException ex, WebRequest request) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(JornalNotSavedException.class)
    public ResponseEntity<String> handleJornalNotSaved(JornalNotSavedException ex, WebRequest request) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @PostMapping("/jornal")
    public ResponseEntity<Object> newJornal(@Valid @RequestBody Jornal newJornal) {
        Jornal savedJornal = jornalService.saveJornal(newJornal);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedJornal);
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/jornal/agregarLluvia")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'JEFE_OBRA')")
    public ResponseEntity<Object> newJornalLLuvia(@Valid @RequestBody Jornal newJornal) {
        Jornal savedJornal = jornalService.saveJornal(newJornal);
        String message = savedJornal.getPersona().getApellido() + ":  horario de lluvia agregado";
        return ResponseEntity.status(HttpStatus.CREATED).body(message);
    }

    @GetMapping("/jornales")
    public ResponseEntity<List<Jornal>> getAllJornals() {
        List<Jornal> jornales = jornalService.getAllJornales();
        return new ResponseEntity<>(jornales, HttpStatus.OK);
    }

    @GetMapping("/jornal/{id}")
    public ResponseEntity<Jornal> getJornalById(@PathVariable Long id) {
        Jornal jornal = jornalService.getJornalById(id);
        return new ResponseEntity<>(jornal, HttpStatus.OK);
    }

    @PutMapping("/jornal/{id}")
    public ResponseEntity<Object> updateJornal(@Valid @RequestBody Jornal newJornal, @PathVariable Long id) {
        Jornal updatedJornal = jornalService.updateJornal(newJornal, id);
        return new ResponseEntity<>(updatedJornal, HttpStatus.OK);
    }

    @DeleteMapping("/jornal/{id}")
    public ResponseEntity<String> deleteJornal(@PathVariable Long id) {
        jornalService.deleteJornal(id);
        return new ResponseEntity<>("Jornal with id " + id + " has been deleted successfully.", HttpStatus.OK);
    }

    @PostMapping("/jornalQr")
    public ResponseEntity<Object> jornalQr(@Valid @RequestBody Jornal newJornal) {
        Jornal savedJornal = jornalService.saveJornalQr(newJornal);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedJornal);
    }

    @GetMapping("/jornal/jornalByPersona/{personaId}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'JEFE_OBRA', 'TRABAJADOR')")
    public ResponseEntity<Optional<Jornal[]>> findJornalesByPersona(@PathVariable Long personaId) {
        Optional<Jornal[]> jornales = jornalService.findJornalesByPersona(personaId);
        return new ResponseEntity<>(jornales, HttpStatus.OK);
    }

    @GetMapping("/jornal/jornalByFiltros/")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'JEFE_OBRA', 'TRABAJADOR')")
    public ResponseEntity<Optional<Jornal[]>> findJornalesByFiltros(
            @RequestParam String fechaDesde,
            @RequestParam String fechaHasta,
            @RequestParam Long obraSeleccionada,
            @RequestParam Long personaId) {
        Optional<Jornal[]> jornales = jornalService.findJornalesByFiltros(fechaDesde, fechaHasta, obraSeleccionada,personaId);
        return new ResponseEntity<>(jornales, HttpStatus.OK);
    }

    @PostMapping("/jornal/validateGeneral")
    public ResponseEntity<Object> validateGeneral(@Valid @RequestBody Jornal jornal) {
        jornalService.validacionGeneralDeDatos(jornal);
        return ResponseEntity.ok().build();
    }


}
