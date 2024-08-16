package com.worklog.backend.service;

import com.worklog.backend.exception.InvalidDataException;
import com.worklog.backend.exception.JornalNotFoundException;
import com.worklog.backend.exception.JornalNotSavedException;
import com.worklog.backend.model.*;
import com.worklog.backend.repository.JornalRepository;
import com.worklog.backend.util.DateTimeUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.*;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class JornalService {

    @Autowired
    private JornalRepository jornalRepository;
    @Autowired
    private PersonaService personaService;
    @Autowired
    private ObraService obraService;
    @Autowired
    private ModificacionService modificacionService;

    private final RolService rolService= new RolService();

    @Transactional
    public Jornal saveJornal(Jornal newJornal) {
        validateJornal(newJornal);
        return jornalRepository.save(newJornal);
    }

    public Jornal saveJornalQr(Jornal newJornal) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (!(authentication instanceof AnonymousAuthenticationToken)) {
                String currentUserName = authentication.getName();
                Persona persona = personaService.findPersonaByUsername(currentUserName);
                Obra obra = newJornal.getObra();
                LocalDate currentDate = LocalDate.now();
                Timestamp currentTimestamp = new Timestamp(new Date().getTime());
                Optional<Jornal[]> jornalActual = jornalRepository.findByPersonaAndObraAndFechaJornalOrderByFechaJornalDesc(persona,obra,currentDate);
                if(jornalActual.isPresent()){
                    int i=0;
                    while ((i < jornalActual.get().length)
                            && (jornalActual.get()[i].getHoraFin() != null)
                            && (jornalActual.get()[i].getTipoJornal().getId().equals(TipoJornal.ID_JORNAL_COMUN))){
                        i++;
                    }
                    if (i == jornalActual.get().length){
                        TipoJornal tipoJornal = new TipoJornal();
                        tipoJornal.setId(TipoJornal.ID_JORNAL_COMUN);
                        newJornal.setPersona(persona);
                        newJornal.setFechaJornal(currentDate);
                        newJornal.setHoraComienzo(currentTimestamp);
                        newJornal.setModificado(false);
                        newJornal.setConfirmado(false);
                        newJornal.setTipoJornal(tipoJornal);
                        return jornalRepository.save(newJornal);
                    }else {
                        Jornal jornal = jornalActual.get()[i];
                        jornal.setHoraFin(currentTimestamp);
                        return jornalRepository.save(jornal);
                    }
                }else {
                    TipoJornal tipoJornal = new TipoJornal();
                    tipoJornal.setId(TipoJornal.ID_JORNAL_COMUN);
                    newJornal.setPersona(persona);
                    newJornal.setFechaJornal(currentDate);
                    newJornal.setHoraComienzo(currentTimestamp);
                    newJornal.setModificado(false);
                    newJornal.setConfirmado(false);
                    newJornal.setTipoJornal(tipoJornal);
                    return jornalRepository.save(newJornal);
                }
            }
            else{
                System.err.println("No se puede registrar un jornal sin estar autentificado");
                return null;
            }


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
        return jornalRepository.findById(id)
                .map(jornal -> {
                    jornal.setPersona(newJornal.getPersona());
                    jornal.setObra(newJornal.getObra());
                    jornal.setFechaJornal(newJornal.getFechaJornal());
                    jornal.setHoraComienzo(newJornal.getHoraComienzo());
                    jornal.setHoraFin(newJornal.getHoraFin());
                    jornal.setModificado(true);
                    jornal.setTipoJornal(newJornal.getTipoJornal());
                    jornal.setConfirmado(newJornal.getConfirmado());
                    return jornalRepository.save(jornal);
                }).orElseThrow(() -> new JornalNotFoundException(id.toString()));
    }

    public Jornal updateJornalWithValidations(Jornal newJornal, Long id, String motivo) {
        return validarUpdate(newJornal, id, motivo);
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

        LocalDate startDate = null;
        LocalDate endDate = null;
        if (fechaDesde != null && !fechaDesde.isBlank()) {
            startDate= DateTimeUtil.parseLocalDate(fechaDesde);
        }
        if (fechaHasta != null && !fechaHasta.isBlank()) {
            endDate= DateTimeUtil.parseLocalDate(fechaHasta);
        }
        DateTimeUtil.validateFechas(startDate, endDate);
        Persona persona = personaId > 0 ? personaService.getPersonaById(personaId) : null;
        Obra obra = obraId > 0 ? obraService.getObraById(obraId) : null;
        Optional<Jornal[]> jornales= jornalRepository.findJornalesByFiltros(startDate, endDate, obra, persona);
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

    @Transactional(readOnly = true)
    public List<Persona> getAllTrabajadoresDeObra(Long obraId) {
        Obra obra=obraService.getObraById(obraId);
        return jornalRepository.getAllTrabajadoresDeObra(obra);
    }

    @Transactional(readOnly = true)
    public List<Persona> getTrabajadoresByObraAndFecha(Long obraId, String fecha) {
        LocalDate fechaJornal = DateTimeUtil.parseLocalDate(fecha);
        //Caso la fecha es anterior a hoy, se obtienen los trabajadores que ingresaron ese día
        //no se cambia la fecha

        // Caso: la fecha es hoy pero es más temprano que el horario laboral
        if (DateTimeUtil.isDateToday(fechaJornal) && DateTimeUtil.isBeforeStartOfWorkDay()) {
            // obtener los trabajadores que fueron ayer
            fechaJornal = LocalDate.now().minusDays(1);
        }
        // Caso: la fecha es mañana
        if (DateTimeUtil.isDateTomorrow(fechaJornal)) {
            // obtener los que ingresaron hoy
            fechaJornal = LocalDate.now();
        }
        // Caso: la fecha es posterior a mañana
        if (DateTimeUtil.isDateAfterTomorrowOrLater(fechaJornal)) {
            // tirar error
            throw new InvalidDataException("No se puede marcar horario de lluvia en un día posterior a mañana.");
        }

        Obra obra=obraService.getObraById(obraId);
        return jornalRepository.getTrabajadoresByObraAndFecha(obra, fechaJornal);
    }

    @Transactional
    public Jornal validarUpdate(Jornal newJornal, Long id, String motivo) {
        newJornal.setId(id);
        validateJornal(newJornal);
        Jornal datosAnteriores= getJornalById(id);
        //Jefe de obra solo puede modificar horarios (no fecha, ni persona, ni obra)
        if(rolService.isUsuarioLoggeadoJefeObra()){
            if(!(newJornal.getObra().getId().equals(datosAnteriores.getObra().getId())) ||
                    !(newJornal.getPersona().getId().equals(datosAnteriores.getPersona().getId())) ||
                    !(newJornal.getFechaJornal().isEqual(datosAnteriores.getFechaJornal())))
            {
                throw new InvalidDataException("Hubo un error, contacte a su administrador");};
        }
        Jornal jornalAnterior = new Jornal();
        jornalAnterior.setPersona(datosAnteriores.getPersona());
        jornalAnterior.setObra(datosAnteriores.getObra());
        jornalAnterior.setFechaJornal(datosAnteriores.getFechaJornal());
        jornalAnterior.setHoraComienzo(datosAnteriores.getHoraComienzo());
        jornalAnterior.setHoraFin(datosAnteriores.getHoraFin());
        jornalAnterior.setModificado(datosAnteriores.getModificado());
        jornalAnterior.setConfirmado(datosAnteriores.getConfirmado());
        jornalAnterior.setTipoJornal(datosAnteriores.getTipoJornal());
        Jornal jornalActualizado = updateJornal(newJornal, id);
        if(jornalActualizado != null){
            Jornal jornalPersistido = getJornalById(id);
            modificacionService.agregarModificacionJornal(jornalAnterior,jornalPersistido,motivo);
            return jornalActualizado;
        }else {
            throw new InvalidDataException("No se encontró el jornal o hubo otro error, contacte a su administrador");
        }
    }

    @Transactional(readOnly = true)
    public List<Obra> getAllObrasByDates(LocalDate fechaDesde, LocalDate fechaHasta){
        return jornalRepository.getAllObrasByDates(fechaDesde,fechaHasta);
    }

    public List<Persona> getAllTrabajadoresDeObraByDates(Obra obra, LocalDate fechaDesde, LocalDate fechaHasta){
        return jornalRepository.getAllTrabajadoresDeObraByDates(obra, fechaDesde, fechaHasta);
    }

    private void validateJornal(Jornal jornal){
        validacionGeneralDeDatos(jornal);
        validacionPersonal(jornal);
    }

    public void validacionGeneralDeDatos(Jornal jornal){
        transformToCorrectTimeZone(jornal);
        if (!DateTimeUtil.isValidTimeRange(jornal.getHoraComienzo(), jornal.getHoraFin())){throw new InvalidDataException("La hora de fin debe ser al menos 30 minutos más tarde que la hora de comienzo");};
        //Los jornales COMUNES no pueden marcarse en fecha posterior a hoy
        if(jornal.getTipoJornal().getId().equals(TipoJornal.ID_JORNAL_COMUN)){
            if(DateTimeUtil.isFuture(jornal.getFechaJornal())){
                {throw new InvalidDataException("El jornal no puede ser marcado a futuro");}
            }
        }

        if (jornal.getTipoJornal().getId().equals(TipoJornal.ID_JORNAL_LLUVIA)){
            if(!DateTimeUtil.isTimeStampWithinWorkingHours(jornal.getHoraComienzo()) ||
                    !DateTimeUtil.isTimeStampWithinWorkingHours(jornal.getHoraFin())){
                throw new InvalidDataException("No se pueden marcar horarios de lluvia por fuera del horario laboral habitual");
            }
        }

    }

    private void validacionPersonal(Jornal jornal){
        if(jornal.getTipoJornal().getId().equals(TipoJornal.ID_JORNAL_LLUVIA)){
            boolean allDayRain=false;
            if(DateTimeUtil.compareTimestampToLocalTime(jornal.getHoraComienzo(), DateTimeUtil.MONDAY_TO_FRIDAY_START) &&
                    DateTimeUtil.compareTimestampToLocalTime(jornal.getHoraFin(), DateTimeUtil.MONDAY_TO_THURSDAY_END
                    ))
            {
                allDayRain=true;
                jornal.setHoraFin(DateTimeUtil.getEndOfWorkdayTimestamp(jornal.getFechaJornal()));
            }
            if(!allDayRain){//Si no es lluvia all day, solo se puede agregar el período de lluvia en trabajadores que haya ingresado ese día
                Optional<Jornal[]> jornales = jornalRepository.findJornalesByFechaObraPersona(jornal.getFechaJornal(), jornal.getObra(), jornal.getPersona());
                if (jornales.isEmpty() && (DateTimeUtil.isBeforeToday(jornal.getFechaJornal()) || DateTimeUtil.isAfterWorkingHours(Timestamp.from(Instant.now())))) { //si esta vacío es porque es un día finalizado o anterior a hoy y esa persona nunca marcó
                    throw new JornalNotSavedException(jornal.getPersona().getApellido(), "No hay ingreso registrado para la obra indicada.");
                }

            }
        }

        //En una misma fecha una persona no puede tener jornales superpuestos en otras obras, sin importar el tipo
        Optional<Jornal[]> jornalesFecha=jornalRepository.findByPersonaAndFechaAndNotObra( jornal.getPersona(), jornal.getFechaJornal(), jornal.getObra());
        try {
            validateNoOverlap(jornalesFecha,jornal);
        } catch (InvalidDataException e) {
            throw new InvalidDataException(jornal.getPersona().getApellido() + " ya tiene un jornal sin finalizar en otra obra para este día");
        }

        //En una misma fecha una persona no puede tener jornales superpuestos del mismo tipo en una misma obra
        Optional<Jornal[]> jornalesFechaObraTipo=jornalRepository.findByFechaJornalAndObraAndPersonaAndTipoJornal(jornal.getFechaJornal(), jornal.getObra(), jornal.getPersona(),jornal.getTipoJornal());
        validateNoOverlap(jornalesFechaObraTipo,jornal);
    }

    private void validateNoOverlap(Optional<Jornal[]> jornales, Jornal nuevoJornal) {
        //Validar que no haya ya un que quede superpuesto con este
        if (jornales.isEmpty()) return;
        if (jornales.isPresent()) {
            // Get the array of Jornal
            Jornal[] jornalArray = jornales.get();

            // Iterate over the Jornal array
            for (Jornal j : jornalArray) {
                if(!(j.getId().equals(nuevoJornal.getId()))) {
                    if (j.getHoraFin() == null)
                        throw new InvalidDataException(nuevoJornal.getPersona().getApellido() + ": ya existe un jornal sin finalizar para este día");
                    if (DateTimeUtil.timeRangesOverlap(j.getHoraComienzo(), j.getHoraFin(), nuevoJornal.getHoraComienzo(), nuevoJornal.getHoraFin())) {
                        throw new InvalidDataException(nuevoJornal.getPersona().getApellido() + ": ya existe un jornal de ese tipo en el horario ingresado");
                    }
                }
            }
        }
    }

    private void transformToCorrectTimeZone(Jornal jornal){
        ZoneId uruguayZoneId = ZoneId.of("America/Montevideo");

        // Convert LocalDateTime to ZonedDateTime in Uruguay timezone
        ZonedDateTime zonedHoraComienzo = jornal.getHoraComienzo().toLocalDateTime().atZone(uruguayZoneId);
        ZonedDateTime zonedHoraFin = jornal.getHoraFin().toLocalDateTime().atZone(uruguayZoneId);

        // Convert ZonedDateTime to UTC
        ZonedDateTime utcHoraComienzo = zonedHoraComienzo.withZoneSameInstant(ZoneId.of("UTC"));
        ZonedDateTime utcHoraFin = zonedHoraFin.withZoneSameInstant(ZoneId.of("UTC"));

        // Convert ZonedDateTime to Timestamp
        Timestamp horaComienzo = Timestamp.valueOf(utcHoraComienzo.toLocalDateTime());
        Timestamp horaFin = Timestamp.valueOf(utcHoraFin.toLocalDateTime());

        jornal.setHoraComienzo(horaComienzo);
        jornal.setHoraFin(horaFin);

    }


    public List<Jornal> convertOptionalArrayToList(Optional<Jornal[]> optionalJornalArray) {
        if (optionalJornalArray.isPresent()) {
            Jornal[] jornalArray = optionalJornalArray.get();
            return Arrays.asList(jornalArray);
        } else {
            return Collections.emptyList();
        }
    }

    public List<Obra> getAllObrasByDates(String fechaDesde, String fechaHasta){
        if (fechaDesde==null || fechaDesde.isEmpty()) throw new InvalidDataException("Selecciona una fecha desde");
        if (fechaHasta==null || fechaHasta.isEmpty()) throw new InvalidDataException("Selecciona una fecha hasta");
        LocalDate startDate= DateTimeUtil.parseLocalDate(fechaDesde);
        LocalDate endDate = DateTimeUtil.parseLocalDate(fechaHasta);
        DateTimeUtil.validateFechas(startDate, endDate);
        return jornalRepository.getAllObrasByDates(startDate,endDate);

    }


}
