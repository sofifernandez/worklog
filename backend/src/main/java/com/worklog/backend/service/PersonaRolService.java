package com.worklog.backend.service;

import com.worklog.backend.exception.PersonaNotFoundException;
import com.worklog.backend.exception.PersonaRolNotFoundException;
import com.worklog.backend.model.Persona;
import com.worklog.backend.model.PersonaRol;
import com.worklog.backend.repository.PersonaRepository;
import com.worklog.backend.repository.PersonaRolRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.TypedQuery;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.persistence.PersistenceContext;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

@Service
public class PersonaRolService {

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    private PersonaRolRepository personaRolRepository;

    @Transactional
    public PersonaRol savePersonaRol(PersonaRol newPersonaRol) {
        try {
            Timestamp currentTimestamp = new Timestamp(new Date().getTime());
            newPersonaRol.setFechaAlta(currentTimestamp);
            newPersonaRol.setFechaModif(null);
            newPersonaRol.setActivo(true);
            return personaRolRepository.save(newPersonaRol);
        } catch (Exception e) {
            return null;
        }
    }

    @Transactional(readOnly = true)
    public List<PersonaRol> getAllPersonaRoles() {
        return personaRolRepository.findAll();
    }

    @Transactional(readOnly = true)
    public PersonaRol getPersonaRolById(Long id) {
        return personaRolRepository.findById(id)
                .orElseThrow(() -> new PersonaRolNotFoundException(id.toString()));
    }

    @Transactional
    public PersonaRol updatePersonaRol(PersonaRol newPersonaRol, Long id) {
        Timestamp currentTimestamp = new Timestamp(new Date().getTime());
        newPersonaRol.setFechaModif(currentTimestamp);
        return personaRolRepository.findById(id)
                .map(personaRol -> {
                    personaRol.setRol(newPersonaRol.getRol());
                    personaRol.setPersona(newPersonaRol.getPersona());
                    personaRol.setFechaAlta(newPersonaRol.getFechaAlta());
                    personaRol.setFechaModif(newPersonaRol.getFechaModif());
                    personaRol.setActivo(newPersonaRol.getActivo());
                    return personaRolRepository.save(personaRol);
                }).orElseThrow(() -> new PersonaRolNotFoundException(id.toString()));
    }

    @Transactional
    public void deletePersonaRol(Long id) {
        if (!personaRolRepository.existsById(id)) {
            throw new PersonaRolNotFoundException(id.toString());
        }
        personaRolRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<Persona> findPersonasByRol(String rol) {
        String queryStr = "SELECT pr.persona FROM PersonaRol pr WHERE pr.rol = :rol";
        TypedQuery<Persona> query = entityManager.createQuery(queryStr, Persona.class);
        query.setParameter("rol", rol);
        return query.getResultList();
    }

    @Transactional(readOnly = true)
    public PersonaRol getPersonaRolActivoByCi(String ci) {
        String queryStr = "SELECT pr FROM PersonaRol pr WHERE pr.persona.ci = :ci AND pr.activo = true";
        TypedQuery<PersonaRol> query = entityManager.createQuery(queryStr, PersonaRol.class);
        query.setParameter("ci", ci);
        try {
            return query.getSingleResult();
        } catch (NoResultException e) {
            throw new PersonaRolNotFoundException(ci);
        }
    }

}