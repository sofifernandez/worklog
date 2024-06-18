package com.worklog.backend.controller;

import com.worklog.backend.exception.JornalNotFoundException;
import com.worklog.backend.model.Jornal;
import com.worklog.backend.model.Persona;
import com.worklog.backend.service.JornalService;
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
import java.util.Optional;

    @RestController
    @CrossOrigin("http://localhost:3000")
//@CrossOrigin("http://100.28.58.113:3000")
    public class JornalController {

        @Autowired
        private JornalService jornalService;

        @ExceptionHandler(JornalNotFoundException.class)
        public ResponseEntity<String> handleJornalNotFoundException(JornalNotFoundException ex, WebRequest request) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
        }

        @PostMapping("/jornal")
        @PreAuthorize("hasRole('ADMINISTRADOR')")
        public ResponseEntity<Object> newJornal(@Valid @RequestBody Jornal newJornal) {
            Jornal savedJornal = jornalService.saveJornal(newJornal);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedJornal);
        }

        @GetMapping("/jornales")
        @PreAuthorize("hasRole('ADMINISTRADOR')")
        public ResponseEntity<List<Jornal>> getAllJornals() {
            List<Jornal> jornales = jornalService.getAllJornales();
            return new ResponseEntity<>(jornales, HttpStatus.OK);
        }

        @GetMapping("/jornal/{id}")
        @PreAuthorize("hasRole('ADMINISTRADOR')")
        public ResponseEntity<Jornal> getJornalById(@PathVariable Long id) {
            Jornal jornal = jornalService.getJornalById(id);
            return new ResponseEntity<>(jornal, HttpStatus.OK);
        }

        @PutMapping("/jornal/{id}")
        @PreAuthorize("hasRole('ADMINISTRADOR')")
        public ResponseEntity<Object> updateJornal(@Valid @RequestBody Jornal newJornal, @PathVariable Long id) {
            Jornal updatedJornal = jornalService.updateJornal(newJornal, id);
            return new ResponseEntity<>(updatedJornal, HttpStatus.OK);
        }

        @DeleteMapping("/jornal/{id}")
        @PreAuthorize("hasRole('ADMINISTRADOR')")
        public ResponseEntity<String> deleteJornal(@PathVariable Long id) {
            jornalService.deleteJornal(id);
            return new ResponseEntity<>("Jornal with id " + id + " has been deleted successfully.", HttpStatus.OK);
        }


        @GetMapping("/jornal/searchByPersona/{persona}")
        public ResponseEntity<Optional<Jornal[]>> findJornalesByPersona(@PathVariable Persona persona) {
            Optional<Jornal[]> jornales = jornalService.findJornalesByPersona(persona);
            return new ResponseEntity<>(jornales, HttpStatus.OK);
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




/*
    @GetMapping("/jornal/searchByUsername/{username}")
    public ResponseEntity<Jornal> findJornalByUsername(@PathVariable String username) {
        Jornal jornal = jornalService.findJornalByUsername(username);
        return new ResponseEntity<>(jornal, HttpStatus.OK);
    }


*/


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
