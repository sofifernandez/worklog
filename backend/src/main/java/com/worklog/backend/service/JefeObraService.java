package com.worklog.backend.service;

import com.worklog.backend.exception.InvalidDataException;
import com.worklog.backend.exception.JefeObraNotFoundException;
import com.worklog.backend.exception.ObraNotFoundException;
import com.worklog.backend.exception.PersonaRolNotFoundException;
import com.worklog.backend.model.JefeObra;
import com.worklog.backend.model.Obra;
import com.worklog.backend.model.Persona;
import com.worklog.backend.model.PersonaRol;
import com.worklog.backend.repository.JefeObraRepository;
import jakarta.persistence.EntityManager;

import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

@Service
public class JefeObraService {

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    private JefeObraRepository jefeObraRepository;

    @Autowired
    private PersonaService personaService;


    @Transactional
    public JefeObra saveJefeObra(JefeObra newJefeObra) {
            Timestamp currentTimestamp = new Timestamp(new Date().getTime());
            newJefeObra.setFechaAlta(currentTimestamp);
            newJefeObra.setFechaModif(currentTimestamp);
            newJefeObra.setActivo(true);
            if(jefeObraRepository.existsByPersona(newJefeObra.getPersona())) throw new InvalidDataException("La persona seleccionada ya es jefe de una obra.");
            return jefeObraRepository.save(newJefeObra);
    }

    @Transactional(readOnly = true)
    public List<JefeObra> getAllJefeObra() {
        return jefeObraRepository.findAll();
    }

    @Transactional(readOnly = true)
    public JefeObra getJefeObraById(Long id) {
        return jefeObraRepository.findById(id)
                .orElseThrow(() -> new JefeObraNotFoundException(id));
    }
   /*  @Transactional
   public JefeObra updateJefeObra(JefeObra newJefeObra, Long id) {
        Timestamp currentTimestamp = new Timestamp(new Date().getTime());
        newJefeObra.setFechaModif(currentTimestamp);
        return jefeObraRepository.findById(id)
                .map(personaRol -> {
                    personaRol.setObra(newJefeObra.getObra());
                    personaRol.setPersona(newJefeObra.getPersona());
                    personaRol.setFechaAlta(newJefeObra.getFechaAlta());
                    personaRol.setFechaModif(newJefeObra.getFechaModif());
                    personaRol.setActivo(newJefeObra.getActivo());
                    return jefeObraRepository.save(personaRol);
                }).orElseThrow(() -> new JefeObraNotFoundException(id));
    }*/

    @Transactional
    public void deleteJefeObra(Long id) {
        if (!jefeObraRepository.existsById(id)) {
            throw new JefeObraNotFoundException(id);
        }
        jefeObraRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public Obra getObraByJefe(Long id){
        Persona persona = personaService.getPersonaById(id);
        Obra obra = jefeObraRepository.getObraByJefe(persona);
        if (obra == null) {throw new ObraNotFoundException("No tienes obras asignadas");}
        return obra;
    }

    public boolean existsByPersona(Persona persona){
        return jefeObraRepository.existsByPersona(persona);
    }

    @Transactional(readOnly = true)
    public String getNombreDeObraByPersona(Persona persona){
        String nombre= "";
        Obra obra =getObraByJefe(persona.getId());
        if(obra!=null){nombre= obra.getNombre();};
        return nombre;
    }

}
