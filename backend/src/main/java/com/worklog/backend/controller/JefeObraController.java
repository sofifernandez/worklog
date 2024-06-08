package com.worklog.backend.controller;

import com.worklog.backend.exception.JefeObraNotFoundException;
import com.worklog.backend.model.JefeObra;
import com.worklog.backend.model.PersonaRol;
import com.worklog.backend.repository.JefeObraRepository;
import com.worklog.backend.service.JefeObraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

@RestController
@CrossOrigin("http://localhost:3000")
public class JefeObraController {

    @Autowired
    private JefeObraService jefeObraService;

    @PostMapping("/jefeObra")
    public ResponseEntity<JefeObra> newJefeObra(@RequestBody JefeObra newJefeObra) {
        JefeObra savedJefeObra = jefeObraService.saveJefeObra(newJefeObra);
        return new ResponseEntity<>(savedJefeObra, HttpStatus.CREATED);
    }

    @GetMapping("/jefeObras")
    List<JefeObra> getAllJefeObras() {
        return jefeObraService.getAllJefeObra();
    }

    @GetMapping("/jefeObra/{id}")
    ResponseEntity<JefeObra> getJefeObraById(@PathVariable Long id) {
        JefeObra jefeObra  = jefeObraService.getJefeObraById(id);
        return new ResponseEntity<>(jefeObra, HttpStatus.OK);
    }

   /* @PutMapping("/jefeObra/{id}")
    ResponseEntity<JefeObra> updateJefeObra(@RequestBody JefeObra newJefeObra, @PathVariable Long id) {
        JefeObra updatedJefeObra = jefeObraService.updateJefeObra(newJefeObra, id);
        return new ResponseEntity<>(updatedJefeObra, HttpStatus.OK);
         }
*/
    @DeleteMapping("/jefeObra/{id}")
    ResponseEntity<String> deleteJefeObra(@PathVariable Long id){
        jefeObraService.deleteJefeObra(id);
        return new ResponseEntity<>("PersonaRol with id " + id + " has been deleted successfully.", HttpStatus.OK);
    }
}
