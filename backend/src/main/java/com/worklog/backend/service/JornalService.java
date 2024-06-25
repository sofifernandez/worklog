package com.worklog.backend.service;

import com.worklog.backend.exception.JornalNotFoundException;
import com.worklog.backend.model.Jornal;
import com.worklog.backend.model.Obra;
import com.worklog.backend.model.Persona;
import com.worklog.backend.repository.JornalRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class JornalService {

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    private JornalRepository jornalRepository;

    @Transactional
    public Jornal saveJornal(Jornal newJornal) {
        try {
            Timestamp currentTimestamp = new Timestamp(new Date().getTime());
            return jornalRepository.save(newJornal);
        } catch (Exception e) {
            // Handle the exception, e.g., log it and/or rethrow it as a custom exception
            System.err.println("An error occurred while saving the Jornal: " + e.getMessage());
            // You can also log the stack trace for more detailed error information
            e.printStackTrace();

            // Optionally, rethrow the exception or return a default/fallback value
            // throw new CustomException("Failed to save Jornal", e);
            return null; // or you might choose to return a default Jornal object or handle it in another way
        }
    }

    @Transactional(readOnly = true)
    public List<Jornal> getAllJornales() {
        return jornalRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Jornal getJornalById(Long id) {
        return jornalRepository.findById(id)
                .orElseThrow(() -> new JornalNotFoundException(id));
    }

    @Transactional
    public Jornal updateJornal(Jornal newJornal, Long id) {
        Timestamp currentTimestamp = new Timestamp(new Date().getTime());
        return jornalRepository.findById(id)
                .map(jornal -> {
                    jornal.setPersona(newJornal.getPersona());
                    jornal.setObra(newJornal.getObra());
                    jornal.setFechaJornal(newJornal.getFechaJornal());
                    jornal.setHoraComienzo(newJornal.getHoraComienzo());
                    jornal.setHoraFin(newJornal.getHoraFin());
                    jornal.setModificado(newJornal.getModificado());
                    jornal.setTipoJornal(newJornal.getTipoJornal());
                    return jornalRepository.save(jornal);
                }).orElseThrow(() -> new JornalNotFoundException(id));
    }

    @Transactional
    public void deleteJornal(Long id) {
        if (!jornalRepository.existsById(id)) {
            throw new JornalNotFoundException(id);
        }
        jornalRepository.deleteById(id);
    }
    public Optional<Jornal[]> findJornalesByPersona(Persona persona) {
       return jornalRepository.findByPersona(persona);
    }

}
