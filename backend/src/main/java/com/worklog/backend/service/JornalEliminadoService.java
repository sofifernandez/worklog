package com.worklog.backend.service;

import com.worklog.backend.exception.InvalidDataException;
import com.worklog.backend.exception.JornalNotFoundException;
import com.worklog.backend.model.Jornal;
import com.worklog.backend.model.JornalEliminado;
import com.worklog.backend.repository.JornalEliminadoRepository;
import com.worklog.backend.util.DateTimeUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.worklog.backend.model.Persona;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.*;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class JornalEliminadoService {

    @Autowired
    private JornalEliminadoRepository jornalEliminadoRepository;

    public void saveJornalEliminado(Jornal jornal, Persona responsable) {
        JornalEliminado newJornalEliminado = new JornalEliminado();
        Timestamp currentTimestamp = new Timestamp(new Date().getTime());
        newJornalEliminado.setId(jornal.getId());
        newJornalEliminado.setPersona(jornal.getPersona());
        newJornalEliminado.setObra(jornal.getObra());
        newJornalEliminado.setFechaJornal(jornal.getFechaJornal());
        newJornalEliminado.setHoraComienzo(jornal.getHoraComienzo());
        newJornalEliminado.setHoraFin(jornal.getHoraFin());
        newJornalEliminado.setModificado(jornal.getModificado());
        newJornalEliminado.setTipoJornal(jornal.getTipoJornal());
        newJornalEliminado.setConfirmado(jornal.getConfirmado());
        newJornalEliminado.setResponsable(responsable);
        newJornalEliminado.setFechaEliminado(currentTimestamp);
        jornalEliminadoRepository.save(newJornalEliminado);
    }

    @Transactional(readOnly = true)
    public List<JornalEliminado> getAllJornalesEliminados() {
        return jornalEliminadoRepository.findAll();
    }

    @Transactional(readOnly = true)
    public JornalEliminado getJornalEliminadoById(Long id) {
        return jornalEliminadoRepository.findById(id)
                .orElseThrow(() -> new JornalNotFoundException(id.toString()));
    }

}
