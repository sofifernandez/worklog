package com.worklog.backend.service;

import com.worklog.backend.dto.DetalleJornalGeneralDTO;
import com.worklog.backend.dto.JornalDataRequestDTO;
import com.worklog.backend.exception.InvalidDataException;
import com.worklog.backend.exception.JornalNotFoundException;
import com.worklog.backend.exception.JornalNotSavedException;
import com.worklog.backend.model.*;
import com.worklog.backend.repository.JornalRepository;
import com.worklog.backend.util.DateTimeUtil;
import jakarta.security.auth.message.AuthException;
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
    @Autowired
    private JornalEliminadoService jornalEliminadoService;

    private final RolService rolService= new RolService();
    @Autowired
    private PersonaRolService personaRolService;
    @Autowired
    private JefeObraService jefeObraService;

    @Transactional
    public Jornal saveJornal(Jornal newJornal) {
        validateJornal(newJornal);
        return jornalRepository.save(newJornal);
    }

    public Jornal saveJornalQr(Long obraID) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication instanceof AnonymousAuthenticationToken)
            throw new InvalidDataException("No se puede registrar un jornal sin estar autentificado");

        String currentUserName = authentication.getName();
        Persona persona = personaService.findPersonaByUsername(currentUserName);
        Obra obra = obraService.getObraById(obraID);
        LocalDate currentDate = LocalDate.now();
        Optional<Jornal[]> jornalesComunesHoy = jornalRepository.findByFechaJornalAndObraAndPersonaAndTipoJornal(currentDate, obra, persona, new TipoJornal(TipoJornal.ID_JORNAL_COMUN));
        if (jornalesComunesHoy.isPresent()) {
            Jornal[] jornales = jornalesComunesHoy.get();
            //Validación por seguidad (que no se empiecen a agregar jornales infinitamente)
            if (jornales.length > 4) { throw new InvalidDataException("No se pudo completar la solicitud. Por favor contacta a tu Administrador");};
            for (Jornal jornal : jornales) {
                if (jornal.getHoraFin() == null) {
                    return nuevaSalidaDeObra(jornal);
                }
            }
            return nuevoIngresoAObra(persona, obra);
        } else {
            //Insertar un nuevo ingreso (nuevo jornal)
            return nuevoIngresoAObra(persona, obra);
        }

    }

    private Jornal nuevoIngresoAObra (Persona persona, Obra obra) {
        Jornal newJornal= new Jornal();
        TipoJornal tipoJornal = new TipoJornal(TipoJornal.ID_JORNAL_COMUN);
        newJornal.setObra(obra);
        newJornal.setPersona(persona);
        newJornal.setFechaJornal(LocalDate.now());
        newJornal.setHoraComienzo(new Timestamp(new Date().getTime()));
        newJornal.setModificado(false);
        newJornal.setConfirmado(false);
        newJornal.setTipoJornal(tipoJornal);
        validacionPersonal(newJornal);
        return jornalRepository.save(newJornal);
    }

    private Jornal nuevaSalidaDeObra(Jornal jornal) {
        jornal.setHoraFin(new Timestamp(new Date().getTime()));
        validacionPersonal(jornal);
        return jornalRepository.save(jornal);
    }

    @Transactional(readOnly = true)
    public List<Jornal> getAllJornales() {
        return jornalRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Jornal[]> getLastJornales() {
        return jornalRepository.findAllOrderedByFechaDESC();
    }

    @Transactional(readOnly = true)
    public Jornal getJornalById(Long id) {
        isAuthorizedToGetJornal(id);
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
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!(authentication instanceof AnonymousAuthenticationToken)) {
            if (!jornalRepository.existsById(id)) {
                throw new JornalNotFoundException(id.toString());
            }
            Jornal jornal = jornalRepository.findById(id).get();
            if (jornal.getModificado()){
                List<Modificacion> modificaciones = modificacionService.findModificacionByJornalId(id);
                for (Modificacion modificacion : modificaciones) {
                    modificacionService.deleteModificacion(modificacion.getId());
                }
            }
            String currentUserName = authentication.getName();
            Persona responsable = personaService.findPersonaByUsername(currentUserName);
            jornalEliminadoService.saveJornalEliminado(jornal, responsable);
            jornalRepository.deleteById(id);
        }
        else{
            System.err.println("No se puede eliminar un jornal sin estar autentificado");
        }
    }

    public Optional<Jornal[]> findJornalesByPersona(Long personaId) {
        Persona persona = personaService.getPersonaById(personaId);
        isAuthorizedToGetJornalesOfPersona(persona);
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
        Optional<Jornal[]> jornales= jornalRepository.findJornalesByRangoDeFechasObraPersona(startDate, endDate, obra, persona);
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
    public Optional<Jornal[]> findJornalesByFiltrosWithDTO(JornalDataRequestDTO jornalDataRequest) {
        jornalDataRequest.validateData();

        LocalDate fechaDesde = LocalDate.parse(jornalDataRequest.getFechaDesde());
        LocalDate fechaHasta = LocalDate.parse(jornalDataRequest.getFechaHasta());
        List<Long> obrasSeleccionadas = jornalDataRequest.getObras();
        List<Long> personasSeleccionadas = jornalDataRequest.getPersonas();

        boolean allActiveObras = obrasSeleccionadas.size()==1 && obrasSeleccionadas.getFirst().equals(0L);
        boolean allActiveTrabajadores= personasSeleccionadas.size()==1 && personasSeleccionadas.getFirst().equals(0L);

        if(allActiveTrabajadores) personasSeleccionadas=null;
        if(allActiveObras) obrasSeleccionadas=null;

        Optional<Jornal[]> jornales= jornalRepository.findJornalesByFechasObrasyPersonas(fechaDesde, fechaHasta, obrasSeleccionadas, personasSeleccionadas);
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

            if(!newJornal.getObra().equals(datosAnteriores.getObra()) ||
                    !newJornal.getPersona().equals(datosAnteriores.getPersona()) ||
                    !newJornal.getFechaJornal().equals(datosAnteriores.getFechaJornal()))

            {throw new InvalidDataException("Hubo un error, contacte a su administrador");};
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

    @Transactional
    public Optional<Jornal[]> findJornalesNoConfirmado(long obraId) {
        Optional<Jornal[]> jornales = jornalRepository.findJornalesNoConfirmado(obraId);
        return jornales;
    }
        @Transactional(readOnly = true)
        public List<Obra> getAllObrasByDates (LocalDate fechaDesde, LocalDate fechaHasta){
            return jornalRepository.getAllObrasByDates(fechaDesde, fechaHasta);
        }

        public List<Persona> getAllTrabajadoresDeObraByDates (Obra obra, LocalDate fechaDesde, LocalDate fechaHasta){
            return jornalRepository.getAllTrabajadoresDeObraByDates(obra, fechaDesde, fechaHasta);
        }

        private void validateJornal (Jornal jornal){
            validacionGeneralDeDatos(jornal);
            validacionPersonal(jornal);
        }

        public void validacionGeneralDeDatos (Jornal jornal) {
            transformToCorrectTimeZone(jornal);
            if (!DateTimeUtil.isValidTimeRange(jornal.getHoraComienzo(), jornal.getHoraFin())) {
                throw new InvalidDataException("La hora de fin debe ser al menos 30 minutos más tarde que la hora de comienzo");
            }
            ;
            //Los jornales COMUNES no pueden marcarse en fecha posterior a hoy
            if (jornal.getTipoJornal().getId().equals(TipoJornal.ID_JORNAL_COMUN)) {
                if (DateTimeUtil.isFuture(jornal.getFechaJornal())) {
                    {
                        throw new InvalidDataException("El jornal no puede ser marcado a futuro");
                    }
                }

                if(DateTimeUtil.isTimeStampAfterNow(jornal.getHoraComienzo()) || DateTimeUtil.isTimeStampAfterNow(jornal.getHoraFin())){
                    throw new InvalidDataException("El jornal no puede ser marcado con horarios a futuro");
                }
            }

            if (jornal.getTipoJornal().getId().equals(TipoJornal.ID_JORNAL_LLUVIA)) {
                if (!DateTimeUtil.isTimeStampWithinWorkingHours(jornal.getHoraComienzo()) ||
                        !DateTimeUtil.isTimeStampWithinWorkingHours(jornal.getHoraFin())) {
                    throw new InvalidDataException("No se pueden marcar horarios de lluvia por fuera del horario laboral habitual");
                }
                double horas = DateTimeUtil.calculateHoursDifference(jornal.getHoraComienzo(), jornal.getHoraFin());
                if(horas > 6) throw new InvalidDataException("La horas de lluvia no pueden ser mayores a 6 por día");
                if (DateTimeUtil.isDateAfterTomorrowOrLater(jornal.getFechaJornal())) {
                    // tirar error
                    throw new InvalidDataException("No se puede marcar horario de lluvia en un día posterior a mañana.");
                }
            }

        }

        private void validacionPersonal (Jornal jornal){
            if (jornal.getTipoJornal().getId().equals(TipoJornal.ID_JORNAL_LLUVIA)) {
                boolean allDayRain = false;
                double horas = DateTimeUtil.calculateHoursDifference(jornal.getHoraComienzo(), jornal.getHoraFin());
                if (horas==6) {allDayRain = true;}
                if (!allDayRain) {//Si no es lluvia all day, solo se puede agregar el período de lluvia en trabajadores que haya ingresado ese día
                    Optional<Jornal[]> jornales = jornalRepository.findJornalesByFechaObraPersona(jornal.getFechaJornal(), jornal.getObra(), jornal.getPersona());
                    if (jornales.isEmpty() && (DateTimeUtil.isBeforeToday(jornal.getFechaJornal()) || DateTimeUtil.isAfterWorkingHours(Timestamp.from(Instant.now())))) { //si esta vacío es porque es un día finalizado o anterior a hoy y esa persona nunca marcó
                        throw new JornalNotSavedException(jornal.getPersona().getApellido(), "No hay ingreso registrado para la obra indicada.");
                    }
                    if (jornales.isPresent()) {
                        List<Jornal> jornalesList = convertOptionalArrayToList(jornales);
                        Map<Boolean, List<Jornal>> partitionedJornalesLluvia = jornalesList.stream()
                                .collect(Collectors.partitioningBy(j -> j.getTipoJornal().getId().equals(TipoJornal.ID_JORNAL_LLUVIA)));
                        double totalHorasLLuvia =calcularTotalHoras(partitionedJornalesLluvia.get(true));
                        if (totalHorasLLuvia >= 6) throw new InvalidDataException("La horas de lluvia no pueden ser mayores a 6 por día");
                    }

                }
            }

            //En una misma fecha una persona no puede tener jornales superpuestos en otras obras, sin importar el tipo
            Optional<Jornal[]> jornalesFecha = jornalRepository.findByPersonaAndFechaAndNotObra(jornal.getPersona(), jornal.getFechaJornal(), jornal.getObra());
            validateNoOverlap(jornalesFecha, jornal);

            //En una misma fecha una persona no puede tener jornales superpuestos del mismo tipo en una misma obra
            Optional<Jornal[]> jornalesFechaObraTipo = jornalRepository.findByFechaJornalAndObraAndPersonaAndTipoJornal(jornal.getFechaJornal(), jornal.getObra(), jornal.getPersona(), jornal.getTipoJornal());
            validateNoOverlap(jornalesFechaObraTipo, jornal);
        }

        public void confirmarJornal (Jornal jornal){
            validateJornal(jornal);
            jornal.setConfirmado(true);
            jornalRepository.save(jornal);
        }

    private void validateNoOverlap(Optional<Jornal[]> jornales, Jornal nuevoJornal) {
        //Validar que no haya ya un que quede superpuesto con este
        if (jornales.isEmpty()) return;

        // Get the array of Jornal
        Jornal[] jornalArray = jornales.get();

        // Iterate over the Jornal array
        for (Jornal j : jornalArray) {
            if (!(j.getId().equals(nuevoJornal.getId()))) {
                if (j.getHoraFin() == null)
                    throw new InvalidDataException(nuevoJornal.getPersona().getApellido() + ": existe un jornal sin finalizar para el día seleccionado");
                if (DateTimeUtil.timeRangesOverlap(j.getHoraComienzo(), j.getHoraFin(), nuevoJornal.getHoraComienzo(), nuevoJornal.getHoraFin())) {
                    throw new InvalidDataException(nuevoJornal.getPersona().getApellido() + ": ya existe un jornal en el horario ingresado");
                }
            }
        }

    }

        private void transformToCorrectTimeZone (Jornal jornal){
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


        public List<Jornal> convertOptionalArrayToList (Optional < Jornal[]>optionalJornalArray){
            if (optionalJornalArray.isPresent()) {
                Jornal[] jornalArray = optionalJornalArray.get();
                return Arrays.asList(jornalArray);
            } else {
                return Collections.emptyList();
            }
        }

        public List<Obra> getAllObrasByDates (String fechaDesde, String fechaHasta){
            if (fechaDesde == null || fechaDesde.isEmpty())
                throw new InvalidDataException("Selecciona una fecha desde");
            if (fechaHasta == null || fechaHasta.isEmpty())
                throw new InvalidDataException("Selecciona una fecha hasta");
            LocalDate startDate = DateTimeUtil.parseLocalDate(fechaDesde);
            LocalDate endDate = DateTimeUtil.parseLocalDate(fechaHasta);
            DateTimeUtil.validateFechas(startDate, endDate);
            return jornalRepository.getAllObrasByDates(startDate, endDate);

        }

    public List<Obra> getAllObrasByDatesAndTrabajador(String fechaDesde, String fechaHasta, Long trabajadorId){
        if (fechaDesde==null || fechaDesde.isEmpty()) throw new InvalidDataException("Selecciona una fecha desde");
        if (fechaHasta==null || fechaHasta.isEmpty()) throw new InvalidDataException("Selecciona una fecha hasta");
        LocalDate startDate= DateTimeUtil.parseLocalDate(fechaDesde);
        LocalDate endDate = DateTimeUtil.parseLocalDate(fechaHasta);
        DateTimeUtil.validateFechas(startDate, endDate);
        return jornalRepository.getAllObrasByDatesAndTrabajador(startDate,endDate, trabajadorId);

    }

    public List<Jornal> getAllJornalesByDatesAndTrabajador(String fechaDesde, String fechaHasta, Long trabajadorId){
        if (fechaDesde==null || fechaDesde.isEmpty()) throw new InvalidDataException("Selecciona una fecha desde");
        if (fechaHasta==null || fechaHasta.isEmpty()) throw new InvalidDataException("Selecciona una fecha hasta");
        LocalDate startDate= DateTimeUtil.parseLocalDate(fechaDesde);
        LocalDate endDate = DateTimeUtil.parseLocalDate(fechaHasta);
        DateTimeUtil.validateFechas(startDate, endDate);
        return jornalRepository.getAllJornalesByDatesAndTrabajador(startDate,endDate, trabajadorId);

    }

    public DetalleJornalGeneralDTO calcularJornal(Persona persona, LocalDate fechaDesde, LocalDate fechaHasta) {
        List<Jornal> jornalesTrabajados = getAllJornalesByDatesAndTrabajador(fechaDesde.toString(), fechaHasta.toString(), persona.getId());

        double horasComunes = 0;
        double horasLluvias = 0;
        double horasExtras = 0;
        List<LocalDate> faltas = new ArrayList<>();

        for (LocalDate date = fechaDesde; !date.isAfter(fechaHasta); date = date.plusDays(1)) {

            LocalDate finalDate = date;
            List<Jornal> jornalesDelDia = jornalesTrabajados.stream()
                    .filter(j -> j.getFechaJornal().equals(finalDate))
                    .toList();

            if (jornalesDelDia.isEmpty()) {
                DayOfWeek dayOfWeek = date.getDayOfWeek();
                if (dayOfWeek != DayOfWeek.SATURDAY && dayOfWeek != DayOfWeek.SUNDAY) {
                    faltas.add(date);
                }
            } else {
                double horasComunesDia = 0;
                double horasLluviasDia = 0;
                double horasExtrasDia = 0;

                for (Jornal jornal : jornalesDelDia) {
                    double horas = DateTimeUtil.calculateHoursDifference(jornal.getHoraComienzo(), jornal.getHoraFin());
                    Long tipoId = jornal.getTipoJornal().getId();

                    if (tipoId.equals(TipoJornal.ID_JORNAL_COMUN)) {
                        horasComunesDia += horas;
                    } else if (tipoId.equals(TipoJornal.ID_JORNAL_LLUVIA)) {
                        horasLluviasDia += horas;
                    } else if (tipoId.equals(TipoJornal.ID_JORNAL_EXTRA)) {
                        horasExtrasDia += horas;
                    }
                }

                double horasNormalesDia = obtenerHorasNormalesDia(date);
                if (horasComunesDia >= horasNormalesDia) {
                    horasExtrasDia += horasComunesDia - horasNormalesDia;
                    horasComunesDia = Math.max(horasNormalesDia - horasLluviasDia, 0);
                }

                horasComunes += horasComunesDia;
                horasLluvias += horasLluviasDia;
                horasExtras += horasExtrasDia;
            }
        }


        DetalleJornalGeneralDTO detalleDTO = new DetalleJornalGeneralDTO();
        detalleDTO.setPersona(persona);
        detalleDTO.setFechaJornal(fechaDesde);
        detalleDTO.setHorasComunes(horasComunes);
        detalleDTO.setHorasLluvias(horasLluvias);
        detalleDTO.setHorasExtras(horasExtras);
        detalleDTO.setFaltas(faltas);

        return detalleDTO;
    }

    private double obtenerHorasNormalesDia(LocalDate date) {
        return date.getDayOfWeek() == DayOfWeek.FRIDAY ? DateTimeUtil.FRIDAY_WH : DateTimeUtil.MONDAY_TO_THURSDAY_WH;
    }

    public boolean existsJornalesSinConfirmarByObraFecha(String fechaDesde, String fechaHasta, Long obraId){
        if (fechaDesde==null || fechaDesde.isEmpty()) throw new InvalidDataException("Selecciona una fecha desde");
        if (fechaHasta==null || fechaHasta.isEmpty()) throw new InvalidDataException("Selecciona una fecha hasta");
        LocalDate startDate= DateTimeUtil.parseLocalDate(fechaDesde);
        LocalDate endDate = DateTimeUtil.parseLocalDate(fechaHasta);
        return jornalRepository.existsJornalesSinConfirmarByObraFecha(startDate, endDate, obraId);
    }

    public void isAuthorizedToGetJornal(Long jornalID) {
        Optional<Jornal> optJornal = jornalRepository.findById(jornalID);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserName = authentication.getName();
        PersonaRol personaRol = personaRolService.getPersonaRolActivoByUsername(currentUserName);
        if (optJornal.isPresent()){
            Jornal jornal = optJornal.get();
            if (personaRol.getRol().getId().equals(Rol.ID_ROL_TRA)){
               if (!jornal.getPersona().getId().equals(personaRol.getPersona().getId())){
                   throw new InvalidDataException ("No tienes autorización para ver los datos");
               }
            }

            if(personaRol.getRol().getId().equals(Rol.ID_ROL_JO)){
                Obra obra = jefeObraService.getObraByJefe(personaRol.getPersona().getId());
                if (obra == null) throw new InvalidDataException("No tienes autorización para ver los datos");

                if(!jornal.getObra().getId().equals(obra.getId())){
                    throw new InvalidDataException("No tienes autorización para ver los datos");
                }
            }

        }
    }

    public void isAuthorizedToGetJornalesOfPersona(Persona persona) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserName = authentication.getName();
        PersonaRol personaRol = personaRolService.getPersonaRolActivoByUsername(currentUserName);
        if (personaRol.getRol().getId().equals(Rol.ID_ROL_TRA)){
            if(!personaRol.getPersona().getId().equals(persona.getId())){
                throw new InvalidDataException ("No tienes autorización para ver los datos");
            }
        }
    }

    private double calcularTotalHoras (List<Jornal> jornales) {
        double total=0;
        for(Jornal j: jornales){
            if(j.getHoraComienzo()!=null & j.getHoraFin()!=null){ //Para que no de NullPointer si está sin terminar
                total+= DateTimeUtil.calculateHoursDifference(j.getHoraComienzo(),j.getHoraFin());
            }
        }
        return total;
    }



}
