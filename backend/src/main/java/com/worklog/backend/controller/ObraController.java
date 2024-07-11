package com.worklog.backend.controller;

import com.worklog.backend.exception.ObraNotFoundException;
import com.worklog.backend.model.Obra;
import com.worklog.backend.service.ObraService;
import com.worklog.backend.repository.ObraRepository;
import com.worklog.backend.service.QrCodeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.WebRequest;

import java.util.List;

@RestController
public class ObraController {

    @Autowired
    private ObraService obraService;

    @ExceptionHandler(ObraNotFoundException.class)
    public ResponseEntity<String> handleObraNotFoundException(ObraNotFoundException ex, WebRequest request) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @PostMapping("/obra")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Obra> newObra(@Valid @RequestBody Obra newObra) {
        Obra savedObra = obraService.saveObra(newObra);
        return new ResponseEntity<>(savedObra, HttpStatus.CREATED);
    }

    @GetMapping("/obras")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'JEFE_OBRA', 'TRABAJADOR')")
    public ResponseEntity<List<Obra>> getAllObras() {
        List<Obra> obras = obraService.getAllObras();
        return new ResponseEntity<>(obras, HttpStatus.OK);
    }

    @GetMapping("/obra/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'JEFE_OBRA')")
    public ResponseEntity<Obra> getObraById(@PathVariable Long id) {
        Obra obra = obraService.getObraById(id);
        return new ResponseEntity<>(obra, HttpStatus.OK);
    }

    @PutMapping("/obra/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Obra> updateObra(@Valid @RequestBody Obra newObra, @PathVariable Long id) {
        Obra updatedObra = obraService.updateObra(newObra, id);
        return new ResponseEntity<>(updatedObra, HttpStatus.OK);
    }

    @DeleteMapping("/obra/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<String> deleteObra(@PathVariable Long id) {
        obraService.deleteObra(id);
        return new ResponseEntity<>("Obra with id " + id + " has been deleted", HttpStatus.OK);
    }

    @GetMapping("/getObraByBPS/{bps}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'JEFE_OBRA')")
    public ResponseEntity<Obra> getObraByBPS(@PathVariable String bps) {
        Obra obra = obraService.getObraByBPS(bps);
        return new ResponseEntity<>(obra, HttpStatus.OK);
    }

    @GetMapping("/getObraByJefe/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'JEFE_OBRA')")
    public ResponseEntity<Obra> getObraByJefe(@PathVariable Long id) {
        Obra obra = obraService.getObraByJefe(id);
        return new ResponseEntity<>(obra, HttpStatus.OK);
    }
}
