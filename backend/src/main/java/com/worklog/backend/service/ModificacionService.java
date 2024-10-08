package com.worklog.backend.service;

import com.worklog.backend.exception.ModificacionNotFoundException;
import com.worklog.backend.model.Jornal;
import com.worklog.backend.model.Modificacion;
import com.worklog.backend.model.Obra;
import com.worklog.backend.model.Persona;
import com.worklog.backend.repository.ModificacionRepository;
import jakarta.persistence.Transient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Objects;

@Service
public class ModificacionService {

    @Autowired
    private ModificacionRepository modificacionRepository;
    @Autowired
    private PersonaService personaService;

    @Transactional
    public Modificacion saveModificacion(Modificacion newModificacion) {
        try {
            Timestamp currentTimestamp = new Timestamp(new Date().getTime());
            newModificacion.setFechaModificacion(currentTimestamp);
            return modificacionRepository.save(newModificacion);
        } catch (Exception e) {
            System.err.println("An error occurred while saving the Modificacion: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    @Transactional(readOnly = true)
    public List<Modificacion> getAllModificaciones() {
        return modificacionRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Modificacion getModificacionById(Long id) {
        return modificacionRepository.findById(id)
                .orElseThrow(() -> new ModificacionNotFoundException(id.toString()));
    }

    @Transactional
    public Modificacion updateModificacion(Modificacion newModificacion, Long id) {
        return modificacionRepository.findById(id)
                .map(modificacion -> {
                    modificacion.setResponsable(newModificacion.getResponsable());
                    modificacion.setJornal(newModificacion.getJornal());
                    modificacion.setFechaModificacion(new Timestamp(new Date().getTime()));
                    modificacion.setCampoModificado(newModificacion.getCampoModificado());
                    modificacion.setValorAnterior(newModificacion.getValorAnterior());
                    modificacion.setValorActual(newModificacion.getValorActual());
                    modificacion.setMotivo(newModificacion.getMotivo());
                    return modificacionRepository.save(modificacion);
                }).orElseThrow(() -> new ModificacionNotFoundException(id.toString()));
    }

    @Transactional
    public void deleteModificacion(Long id) {
        if (!modificacionRepository.existsById(id)) {
            throw new ModificacionNotFoundException("Modificacion not found with id " + id);
        }
        modificacionRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<Modificacion> findModificacionByJornalId(Long jornalId) {
        return modificacionRepository.findModificacionByJornalId(jornalId);
    }

    @Transactional
    public void agregarModificacionJornal(Jornal datosAnteriores, Jornal datosNuevos, String motivo){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserName = authentication.getName();
        Persona persona = personaService.findPersonaByUsername(currentUserName);
        if(!(datosAnteriores.getFechaJornal().isEqual(datosNuevos.getFechaJornal()))){
            Modificacion nuevaModificacion = new Modificacion();
            nuevaModificacion.setJornal(datosNuevos);
            nuevaModificacion.setResponsable(persona);
            nuevaModificacion.setMotivo(motivo);
            nuevaModificacion.setFechaModificacion(new Timestamp(new Date().getTime()));
            nuevaModificacion.setCampoModificado(Modificacion.CAMPO_FECHA);
            nuevaModificacion.setValorAnterior(datosAnteriores.getFechaJornal().toString());
            nuevaModificacion.setValorActual(datosNuevos.getFechaJornal().toString());
            modificacionRepository.save(nuevaModificacion);
        }
        if(!(datosAnteriores.getHoraComienzo().equals(datosNuevos.getHoraComienzo()))){
            Modificacion nuevaModificacion = new Modificacion();
            nuevaModificacion.setJornal(datosNuevos);
            nuevaModificacion.setResponsable(persona);
            nuevaModificacion.setMotivo(motivo);
            nuevaModificacion.setFechaModificacion(new Timestamp(new Date().getTime()));
            nuevaModificacion.setCampoModificado(Modificacion.CAMPO_HORA_COMIENZO);
            nuevaModificacion.setValorAnterior(datosAnteriores.getHoraComienzo().toString());
            nuevaModificacion.setValorActual(datosNuevos.getHoraComienzo().toString());
            modificacionRepository.save(nuevaModificacion);
        }
        if((datosAnteriores.getHoraFin() == null) || (datosNuevos.getHoraFin() == null)) {
            if(!(datosNuevos.getHoraFin() == null)){
                Modificacion nuevaModificacion = new Modificacion();
                nuevaModificacion.setJornal(datosNuevos);
                nuevaModificacion.setResponsable(persona);
                nuevaModificacion.setMotivo(motivo);
                nuevaModificacion.setFechaModificacion(new Timestamp(new Date().getTime()));
                nuevaModificacion.setCampoModificado(Modificacion.CAMPO_HORA_FIN);
                nuevaModificacion.setValorAnterior("Sin hora de salida");
                nuevaModificacion.setValorActual(datosNuevos.getHoraFin().toString());
                modificacionRepository.save(nuevaModificacion);
            }else if(!(datosAnteriores.getHoraFin() == null)){
                Modificacion nuevaModificacion = new Modificacion();
                nuevaModificacion.setJornal(datosNuevos);
                nuevaModificacion.setResponsable(persona);
                nuevaModificacion.setMotivo(motivo);
                nuevaModificacion.setFechaModificacion(new Timestamp(new Date().getTime()));
                nuevaModificacion.setCampoModificado(Modificacion.CAMPO_HORA_FIN);
                nuevaModificacion.setValorAnterior(datosAnteriores.getHoraFin().toString());
                nuevaModificacion.setValorActual("Sin hora de salida");
                modificacionRepository.save(nuevaModificacion);
            }
        }else if(!(datosAnteriores.getHoraFin().equals(datosNuevos.getHoraFin()))){
            Modificacion nuevaModificacion = new Modificacion();
            nuevaModificacion.setJornal(datosNuevos);
            nuevaModificacion.setResponsable(persona);
            nuevaModificacion.setMotivo(motivo);
            nuevaModificacion.setFechaModificacion(new Timestamp(new Date().getTime()));
            nuevaModificacion.setCampoModificado(Modificacion.CAMPO_HORA_FIN);
            nuevaModificacion.setValorAnterior(datosAnteriores.getHoraFin().toString());
            nuevaModificacion.setValorActual(datosNuevos.getHoraFin().toString());
            modificacionRepository.save(nuevaModificacion);
        }
        if(!(Objects.equals(datosAnteriores.getObra().getId(), datosNuevos.getObra().getId()))){
            Modificacion nuevaModificacion = new Modificacion();
            nuevaModificacion.setJornal(datosNuevos);
            nuevaModificacion.setResponsable(persona);
            nuevaModificacion.setMotivo(motivo);
            nuevaModificacion.setFechaModificacion(new Timestamp(new Date().getTime()));
            nuevaModificacion.setCampoModificado(Modificacion.CAMPO_OBRA);
            nuevaModificacion.setValorAnterior(datosAnteriores.getObra().getNombre());
            nuevaModificacion.setValorActual(datosNuevos.getObra().getNombre());
            nuevaModificacion.setValorActual(datosNuevos.getObra().getNombre());
            modificacionRepository.save(nuevaModificacion);
        }/*
        Oportunidad de Mejora en Registro de Jornal eliminado.
        if(motivo.equals("Jornal Eliminado")){
            Modificacion nuevaModificacion = new Modificacion();
            nuevaModificacion.setJornal(datosNuevos);
            nuevaModificacion.setResponsable(persona);
            nuevaModificacion.setMotivo(motivo);
            nuevaModificacion.setFechaModificacion(new Timestamp(new Date().getTime()));
            nuevaModificacion.setCampoModificado(Modificacion.JORNAL_ELIMINADO);
            nuevaModificacion.setValorAnterior("ID de JORNAL: " + datosNuevos.getId().toString());
            nuevaModificacion.setValorActual("JORNAL ELIMINADO");
            modificacionRepository.save(nuevaModificacion);
        }*/
    }

    public List<Modificacion> getModificacionesByFechasAndObras(LocalDate fechaDesde, LocalDate fechaHasta, List<Long> obraIds ){
        return modificacionRepository.getModificacionesByFechasAndObras(fechaDesde, fechaHasta, obraIds);
    }
}
