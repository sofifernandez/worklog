package com.worklog.backend.service;

import com.worklog.backend.exception.PersonaNotFoundException;
import com.worklog.backend.model.Persona;
import com.worklog.backend.repository.PersonaRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

@Service
public class PersonaService {
    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    private PersonaRepository personaRepository;

    @Transactional
    public Persona savePersona(Persona newPersona) {
        try {
            Timestamp currentTimestamp = new Timestamp(new Date().getTime());
            newPersona.setFechaAlta(currentTimestamp);
            newPersona.setFechaModif(null);
            return personaRepository.save(newPersona);
        } catch (Exception e) {
            // Handle the exception, e.g., log it and/or rethrow it as a custom exception
            System.err.println("An error occurred while saving the Persona: " + e.getMessage());
            // You can also log the stack trace for more detailed error information
            e.printStackTrace();

            // Optionally, rethrow the exception or return a default/fallback value
            // throw new CustomException("Failed to save Persona", e);
            return null; // or you might choose to return a default Persona object or handle it in another way
        }
    }

    @Transactional(readOnly = true)
    public List<Persona> getAllPersonas() {
        return personaRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Persona getPersonaById(Long id) {
        return personaRepository.findById(id)
                .orElseThrow(() -> new PersonaNotFoundException(id.toString()));
    }

    @Transactional
    public Persona updatePersona(Persona newPersona, Long id) {
        Timestamp currentTimestamp = new Timestamp(new Date().getTime());
        newPersona.setFechaModif(currentTimestamp);
        return personaRepository.findById(id)
                .map(persona -> {
                    persona.setNombre(newPersona.getNombre());
                    persona.setApellido(newPersona.getApellido());
                    persona.setCi(newPersona.getCi());
                    persona.setFechaNacimiento(newPersona.getFechaNacimiento());
                    persona.setNumeroTelefono(newPersona.getNumeroTelefono());
                    persona.setFechaModif(newPersona.getFechaModif());
                    persona.setActivo(newPersona.getActivo());
                    return personaRepository.save(persona);
                }).orElseThrow(() -> new PersonaNotFoundException(id.toString()));
    }

    @Transactional
    public void deletePersona(Long id) {
        if (!personaRepository.existsById(id)) {
            throw new PersonaNotFoundException(id.toString());
        }
        personaRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public Persona findPersonaByCi(String ci) {
        return personaRepository.findByCi(ci)
                .orElseThrow(() -> new PersonaNotFoundException(ci));
    }

    public List<Persona> findPersonaByCustomCriteria(String apellido) {
        String queryStr = "SELECT P FROM Persona P WHERE P.apellido = :apellido";
        TypedQuery<Persona> query = entityManager.createQuery(queryStr, Persona.class);
        query.setParameter("apellido", apellido);
        return query.getResultList();
   }
}