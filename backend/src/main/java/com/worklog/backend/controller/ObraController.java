package com.worklog.backend.controller;

import com.worklog.backend.exception.ObraNotFoundException;
import com.worklog.backend.model.Obra;
import com.worklog.backend.repository.ObraRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

@RestController
@CrossOrigin("http://localhost:3000")
public class ObraController {

    @Autowired
    private ObraRepository obraRepository;

    @PostMapping("/obra")
    Obra newObra(@Valid @RequestBody Obra newObra) {
        Timestamp currentTimestamp = new Timestamp(new Date().getTime());
        newObra.setFechaAlta(currentTimestamp);
        newObra.setFechaModif(currentTimestamp);
        return obraRepository.save(newObra);
    }

    @GetMapping("/obras")
    List<Obra> getAllObras() {
        return obraRepository.findAll();
    }

    @GetMapping("/obra/{id}")
    Obra getObraById(@PathVariable Long id) {
        return obraRepository.findById(id)
                .orElseThrow(() -> new ObraNotFoundException(id));
    }

    @PutMapping("/obra/{id}")
    Obra updateObra(@Valid @RequestBody Obra newObra, @PathVariable Long id) {
        Timestamp currentTimestamp = new Timestamp(new Date().getTime());
        newObra.setFechaModif(currentTimestamp);
        return obraRepository.findById(id)
                .map(obra -> {
                    obra.setNombre(newObra.getNombre());
                    obra.setBps(newObra.getBps());
                    obra.setFechaModif(newObra.getFechaModif());
                    obra.setActivo(newObra.getActivo());
                    return obraRepository.save(obra);
                }).orElseThrow(() -> new ObraNotFoundException(id));
    }

    @DeleteMapping("/obra/{id}")
    String deleteObra(@PathVariable Long id){
        if(!obraRepository.existsById(id)){
            throw new ObraNotFoundException(id);
        }
        obraRepository.deleteById(id);
        return  "Obra with id "+id+" has been deleted";
    }
}
