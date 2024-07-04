package com.worklog.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.worklog.backend.exception.JornalNotFoundException;
import com.worklog.backend.exception.JornalNotSavedException;
import com.worklog.backend.model.Jornal;
import com.worklog.backend.model.Obra;
import com.worklog.backend.model.Persona;
import com.worklog.backend.model.TipoJornal;
import com.worklog.backend.repository.JornalRepository;
import com.worklog.backend.util.DateUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class JornalService {

    @Autowired
    private JornalRepository jornalRepository;
    @Autowired
    private PersonaService personaService;
    @Autowired
    private ObraService obraService;

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
                .orElseThrow(() -> new JornalNotFoundException(id.toString()));
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
                    jornal.setConfirmado(newJornal.getConfirmado());
                    return jornalRepository.save(jornal);
                }).orElseThrow(() -> new JornalNotFoundException(id.toString()));
    }

    @Transactional
    public void deleteJornal(Long id) {
        if (!jornalRepository.existsById(id)) {
            throw new JornalNotFoundException(id.toString());
        }
        jornalRepository.deleteById(id);
    }
    public Optional<Jornal[]> findJornalesByPersona(Long personaId) {
        Persona persona = personaService.getPersonaById(personaId);
       return jornalRepository.findByPersonaOrderedByFechaJornalDesc(persona);
    }

    @Transactional(readOnly = true)
    public Optional<Jornal[]> findJornalesByFiltros(String fechaDesde, String fechaHasta, Long obraId, Long personaId) {

        Timestamp startTimestamp = DateUtil.toStartOfDayTimestamp(fechaDesde);
        Timestamp endTimestamp = DateUtil.toEndOfDayTimestamp(fechaHasta);

        Persona persona = personaId > 0 ? personaService.getPersonaById(personaId) : null;
        Obra obra = obraId > 0 ? obraService.getObraById(obraId) : null;
        Optional<Jornal[]> jornales= jornalRepository.findJornalesByFiltros(startTimestamp, endTimestamp, obra, persona);
        if (jornales.isPresent()) {
            Jornal[] jornalesArray = jornales.get();
            if (jornalesArray.length == 0) {
                throw new JornalNotFoundException("");
            }
            return jornales;
        } else {
            throw new JornalNotFoundException("");
        }
    }

    @Transactional
    public Optional<Jornal[]> findJornalesByFechaObraPersona(Timestamp fecha, Long obraId, Long personaId) {
        Persona persona = personaService.getPersonaById(personaId);
        Obra obra = obraService.getObraById(obraId);
        Optional<Jornal[]> jornales= jornalRepository.findJornalesByFechaObraPersona(fecha, obra, persona);
        return jornales;
    }

    @Transactional
    public void agregarLLuvia(Object lluviaDetalles) {
        //OBJECT = {tarabajadorId, obraId, fecha, horaComienzo, horaFin}
        ObjectMapper mapper = new ObjectMapper();
        Map<String, Object> lluviaMap = mapper.convertValue(lluviaDetalles, Map.class);
        Long trabajadorId = (Long) lluviaMap.get("trabajadorId");
        Long obraId = (Long) lluviaMap.get("obraId");
        String fecha = (String) lluviaMap.get("fecha");
        String horaComienzo = (String) lluviaMap.get("horaComienzo");
        String horaFin = (String) lluviaMap.get("horaFin");
        Timestamp fechaTimeStamp = DateUtil.toStartOfDayTimestamp(fecha);
        Timestamp horaComienzoTimeStamp = DateUtil.toTimestampFromTime(horaComienzo);
        Timestamp horaFinTimeStamp = DateUtil.toTimestampFromTime(horaFin);
        Persona persona = personaService.getPersonaById(trabajadorId);
        Obra obra = obraService.getObraById(obraId);
        Optional<Jornal[]> jornales = findJornalesByFechaObraPersona(fechaTimeStamp, obraId, trabajadorId);
        if (jornales.isEmpty() && (DateUtil.isBeforeToday(fechaTimeStamp)|| !DateUtil.isBefore4PM())) { //si esta vacío es porque es un día finalizado o anterior a hoy y esa persona nunca marcó
            throw new JornalNotSavedException(persona.getApellido());
        }

        Jornal jornal = new Jornal();
        jornal.setObra(obra);
        jornal.setPersona(persona);
        jornal.setConfirmado(true);
        jornal.setFechaJornal(fechaTimeStamp);
        jornal.setHoraComienzo(horaComienzoTimeStamp);
        jornal.setHoraFin(horaFinTimeStamp);
        jornal.setTipoJornal(new TipoJornal(TipoJornal.ID_JORNAL_LLUVIA));
        saveJornal(jornal);
    }



}
