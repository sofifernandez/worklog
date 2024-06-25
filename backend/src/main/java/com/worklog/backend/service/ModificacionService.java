package com.worklog.backend.service;

import com.worklog.backend.exception.ModificacionNotFoundException;
import com.worklog.backend.model.Modificacion;
import com.worklog.backend.repository.ModificacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

@Service
public class ModificacionService {


    @Autowired
    private ModificacionRepository modificacionRepository;

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
                    modificacion.setJefeObra(newModificacion.getJefeObra());
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
    public Modificacion findModificacionByJornalId(Long jornalId) {
        return modificacionRepository.findModificacionByJornalId(jornalId);
    }
}
