package com.worklog.backend.controller;

import com.worklog.backend.exception.ModificacionNotFoundException;
import com.worklog.backend.model.Modificacion;
import com.worklog.backend.service.ModificacionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.WebRequest;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin("http://localhost:3000")
public class ModificacionController {

    @Autowired
    private ModificacionService modificacionService;

    @ExceptionHandler(ModificacionNotFoundException.class)
    public ResponseEntity<String> handleResourceNotFoundException(ModificacionNotFoundException ex, WebRequest request) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @PostMapping("/modificacion")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Object> newModificacion(@Valid @RequestBody Modificacion newModificacion, BindingResult result) {
        if (result.hasErrors()) {
            return getValidationErrors(result);
        }
        Modificacion savedModificacion = modificacionService.saveModificacion(newModificacion);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedModificacion);
    }

    @GetMapping("/modificaciones")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<List<Modificacion>> getAllModificaciones() {
        List<Modificacion> modificaciones = modificacionService.getAllModificaciones();
        return new ResponseEntity<>(modificaciones, HttpStatus.OK);
    }

    @GetMapping("/modificacion/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Modificacion> getModificacionById(@PathVariable Long id) {
        Modificacion modificacion = modificacionService.getModificacionById(id);
        return new ResponseEntity<>(modificacion, HttpStatus.OK);
    }

    @PutMapping("/modificacion/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Object> updateModificacion(@Valid @RequestBody Modificacion newModificacion, @PathVariable Long id, BindingResult result) {
        if (result.hasErrors()) {
            return getValidationErrors(result);
        }
        Modificacion updatedModificacion = modificacionService.updateModificacion(newModificacion, id);
        return new ResponseEntity<>(updatedModificacion, HttpStatus.OK);
    }

    @DeleteMapping("/modificacion/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<String> deleteModificacion(@PathVariable Long id) {
        modificacionService.deleteModificacion(id);
        return new ResponseEntity<>("Modificacion with id " + id + " has been deleted successfully.", HttpStatus.OK);
    }

    @GetMapping("/modificacion/searchByJornalId/{jornalId}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Modificacion> findModificacionByJornalId(@PathVariable Long jornalId) {
        Modificacion modificacion = modificacionService.findModificacionByJornalId(jornalId);
        return new ResponseEntity<>(modificacion, HttpStatus.OK);
    }

    private ResponseEntity<Object> getValidationErrors(BindingResult result) {
        if (result.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            for (FieldError error : result.getFieldErrors()) {
                errors.put(error.getField(), error.getDefaultMessage());
            }
            return ResponseEntity.badRequest().body(errors);
        }
        return null;
    }
}
