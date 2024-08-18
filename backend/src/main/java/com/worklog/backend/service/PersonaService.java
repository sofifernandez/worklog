package com.worklog.backend.service;

import com.worklog.backend.exception.InvalidDataException;
import com.worklog.backend.exception.PersonaNotFoundException;
import com.worklog.backend.model.Obra;
import com.worklog.backend.model.Persona;
import com.worklog.backend.repository.PersonaRepository;
import com.worklog.backend.repository.UsuarioRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.*;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PersonaService {

    @Autowired
    private PersonaRepository personaRepository;

    @Autowired
    private UsuarioService usuarioService;

    @Transactional
    public Persona savePersona(Persona newPersona) {
        validarFechaDeNacimiento(newPersona.getFechaNacimiento());
        Timestamp currentTimestamp = new Timestamp(new Date().getTime());
        newPersona.setFechaAlta(currentTimestamp);
        newPersona.setFechaModif(currentTimestamp);
        Persona persona = personaRepository.save(newPersona);
        usuarioService.newUsuario(persona);
        return persona;
    }

    private void validarFechaDeNacimiento(Date fechaDeNacimiento) throws InvalidDataException {
        // Define the expected time zone (replace with your specific time zone if necessary)
        ZoneId timeZone = ZoneId.of("America/Montevideo");

        LocalDate birthDate = adjustDateToLocalDate(fechaDeNacimiento, timeZone);
        LocalDate today = LocalDate.now();
        int age = Period.between(birthDate, today).getYears();

        if (age < 18) {
            throw new InvalidDataException("fechaNacimiento", "Fecha de nacimiento incorrecta. Debe tener al menos 18 años.");
        }
    }


    private LocalDate adjustDateToLocalDate(Date fechaDeNacimiento, ZoneId zoneId) throws InvalidDataException {
        if (fechaDeNacimiento == null) {
            throw new InvalidDataException("La fecha de nacimiento no puede ser nula");
        }

        // Use Calendar to handle the date and adjust for timezone
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(fechaDeNacimiento);
        ZonedDateTime zonedDateTime = calendar.toInstant().atZone(zoneId);

        // Extract LocalDate from ZonedDateTime
        return zonedDateTime.toLocalDate();
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
        if(ci==null || ci.isEmpty() || ci.isBlank()) throw new InvalidDataException("Ingrese un parámetro de búsqueda");
        return personaRepository.findByCi(ci)
                .orElseThrow(() -> new PersonaNotFoundException(ci));
    }

    @Transactional(readOnly = true)
    public Persona findPersonaByUsername(String username) {
        return personaRepository.findPersonaByUsername(username);
    }

    @Transactional(readOnly = true)
    public Optional<Persona[]> getAllTrabajadoresActivos() {
        return personaRepository.getAllTrabajadoresActivos();
    }

    @Transactional(readOnly = true)
    public List<Persona> getPersonasByNombre(String parametro) {
       if(parametro==null || parametro.isEmpty() || parametro.isBlank()) throw new InvalidDataException("Ingrese un parámetro de búsqueda");
       if (parametro.contains(" ") && !parametro.trim().equals(parametro)) {
           String[] parts = parametro.split(" ", 2);
           String nombre = "%" + parts[0] + "%";
           String apellido = "%" + parts[1] + "%";
           return personaRepository.getPersonasByNombreyApellido(nombre, apellido);
       } else {
           String nombrePattern = "%" + parametro + "%";
           return personaRepository.getPersonasByNombreOApellido(nombrePattern);
       }
    }

    @Transactional(readOnly = true)
    public List<Persona> getPersonasByIds(List<Long> ids) {
        return ids.stream()
                .map(personaRepository::findById)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .collect(Collectors.toList());
    }



}
