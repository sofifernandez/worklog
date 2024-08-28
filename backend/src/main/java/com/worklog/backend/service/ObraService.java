package com.worklog.backend.service;

import com.worklog.backend.exception.InvalidDataException;
import com.worklog.backend.exception.ObraNotFoundException;
import com.worklog.backend.model.Obra;
import com.worklog.backend.model.Persona;
import com.worklog.backend.repository.ObraRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;


@Service
public class ObraService {

    @Autowired
    private ObraRepository obraRepository;
    @Autowired
    private QrCodeService qrCodeService;
    @Value("${servidor.frontend}")
    private String servidorFrontend;

    public Obra saveObra(Obra newObra) {
        Timestamp currentTimestamp = new Timestamp(new Date().getTime());
        newObra.setFechaAlta(currentTimestamp);
        newObra.setFechaModif(currentTimestamp);
        Obra savedObra = obraRepository.save(newObra); // Primero lo guardo asi se genera el ID
        String qrCodeUrl = servidorFrontend + "/jornalQr/" + savedObra.getId(); // Luego hay que cambiar esta URL
        qrCodeService.saveCodeQR(newObra, qrCodeUrl );
        return obraRepository.save(newObra);
    }

    @Transactional(readOnly = true)
    public List<Obra> getAllObras() {
        return obraRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Obra getObraById(Long id) {
        return obraRepository.findById(id).orElseThrow(() -> new ObraNotFoundException("No se encontró la obra ingresada"));
    }

    public Obra updateObra(Obra newObra, Long id) {
        Timestamp currentTimestamp = new Timestamp(new Date().getTime());
        newObra.setFechaModif(currentTimestamp);
        return obraRepository.findById(id)
                .map(obra -> {
                    obra.setNombre(newObra.getNombre());
                    obra.setBps(newObra.getBps());
                    obra.setFechaModif(newObra.getFechaModif());
                    obra.setActivo(newObra.getActivo());
                    return obraRepository.save(obra);
                }).orElseThrow(() -> new ObraNotFoundException(id.toString()));
    }

    public void deleteObra(Long id) {
        if (!obraRepository.existsById(id)) {
            throw new ObraNotFoundException(id.toString());
        }
        obraRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public Obra getObraByBPS(String bps) {
        Obra obra = obraRepository.findByBps(bps);
        if (obra == null) {throw new ObraNotFoundException(bps);}
        return obra;
    }

    @Transactional(readOnly = true)
    public List<Obra>  getObraByNombre(String nombre) {
        if(nombre==null || nombre.isEmpty() || nombre.isBlank()) throw new InvalidDataException("Ingrese un parámetro de búsqueda");
        String nombrePattern = "%" + nombre + "%";
        return obraRepository.getObrasByNombre(nombrePattern);
    }


    @Transactional(readOnly = true)
    public List<Obra> getObrasByIds(List<Long> ids) {
        return ids.stream()
                .map(obraRepository::findById)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .collect(Collectors.toList());
    }
}
