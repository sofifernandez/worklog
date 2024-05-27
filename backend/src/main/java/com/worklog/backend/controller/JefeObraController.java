package com.worklog.backend.controller;

import com.worklog.backend.exception.JefeObraNotFoundException;
import com.worklog.backend.model.JefeObra;
import com.worklog.backend.repository.JefeObraRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

@RestController
@CrossOrigin("http://localhost:3000")
public class JefeObraController {

    @Autowired
    private JefeObraRepository jefeObraRepository;

    @PostMapping("/jefeObra")
    JefeObra newJefeObra(@RequestBody JefeObra newJefeObra) {
        Timestamp currentTimestamp = new Timestamp(new Date().getTime());
        newJefeObra.setFechaAlta(currentTimestamp);
        newJefeObra.setFechaModif(null);
        return jefeObraRepository.save(newJefeObra);
    }

    @GetMapping("/jefeObras")
    List<JefeObra> getAllJefeObras() {
        return jefeObraRepository.findAll();
    }

    @GetMapping("/jefeObra/{id}")
    JefeObra getJefeObraById(@PathVariable Long id) {
        return jefeObraRepository.findById(id)
                .orElseThrow(() -> new JefeObraNotFoundException(id));
    }

    @PutMapping("/jefeObra/{id}")
    JefeObra updateJefeObra(@RequestBody JefeObra newJefeObra, @PathVariable Long id) {
        Timestamp currentTimestamp = new Timestamp(new Date().getTime());
        newJefeObra.setFechaModif(currentTimestamp);
        return jefeObraRepository.findById(id)
                .map(jefeObra -> {
                    jefeObra.setPersona(newJefeObra.getPersona());
                    jefeObra.setObra(newJefeObra.getObra());
                    jefeObra.setFechaModif(newJefeObra.getFechaModif());
                    jefeObra.setFechaAlta(newJefeObra.getFechaAlta());
                    jefeObra.setActivo(newJefeObra.getActivo());
                    return jefeObraRepository.save(jefeObra);
                }).orElseThrow(() -> new JefeObraNotFoundException(id));
    }

    @DeleteMapping("/jefeObra/{id}")
    String deleteJefeObra(@PathVariable Long id){
        if(!jefeObraRepository.existsById(id)){
            throw new JefeObraNotFoundException(id);
        }
        jefeObraRepository.deleteById(id);
        return  "JefeObra with id "+id+" has been deleted successfully.";
    }
}
