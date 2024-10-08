package com.worklog.backend.controller;

import com.worklog.backend.model.Obra;
import com.worklog.backend.model.Persona;
import com.worklog.backend.service.JornalService;
import com.worklog.backend.service.ObraService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ObraController {

    @Autowired
    private ObraService obraService;

    @Autowired
    private JornalService jornalService;

//    @ExceptionHandler(ObraNotFoundException.class)
//    public ResponseEntity<String> handleObraNotFoundException(ObraNotFoundException ex, WebRequest request) {
//        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
//    }

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
    //@PreAuthorize("hasRole('ADMINISTRADOR')")
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

    @GetMapping("/getObraByNombre/{nombre}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'JEFE_OBRA')")
    public ResponseEntity< List<Obra>> getObraByNombre(@PathVariable String nombre) {
        List<Obra> obras = obraService.getObraByNombre(nombre);
        return new ResponseEntity<>(obras, HttpStatus.OK);
    }

    @GetMapping("/getAllObrasByDates/")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<List<Obra>> getAllObrasByDates(
            @RequestParam String fechaDesde,
            @RequestParam String fechaHasta) {
        List<Obra> obras = jornalService.getAllObrasByDates(fechaDesde,fechaHasta);
        return new ResponseEntity<>(obras, HttpStatus.OK);
    }

    @GetMapping("/getAllObrasByDatesAndTrabajador/")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'JEFE_OBRA', 'TRABAJADOR')")
    public ResponseEntity<List<Obra>> getAllObrasByDatesAndTrabajador(
            @RequestParam String fechaDesde,
            @RequestParam String fechaHasta,
            @RequestParam Long persona_id) {
        List<Obra> obras = jornalService.getAllObrasByDatesAndTrabajador(fechaDesde,fechaHasta, persona_id);
        return new ResponseEntity<>(obras, HttpStatus.OK);
    }


}
