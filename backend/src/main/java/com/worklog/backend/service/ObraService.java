package com.worklog.backend.service;

import com.worklog.backend.exception.ObraNotFoundException;
import com.worklog.backend.model.Obra;
import com.worklog.backend.model.Persona;
import com.worklog.backend.repository.ObraRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;


@Service
public class ObraService {

    @Autowired
    private ObraRepository obraRepository;
    @Autowired
    private PersonaService personaService;

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

    public List<Obra> getAllObras() {
        return obraRepository.findAll();
    }

    public Obra getObraById(Long id) {
        return obraRepository.findById(id).orElseThrow(() -> new ObraNotFoundException(id.toString()));
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

    public Obra getObraByBPS(String bps) {
        Obra obra = obraRepository.findByBps(bps);
        if (obra == null) {throw new ObraNotFoundException(bps);}
        return obra;
    }

    public Obra getObraByJefe(Long id){
        Persona persona = personaService.getPersonaById(id);
        Obra obra = obraRepository.getObraByJefe(persona);
        if (obra == null) {throw new ObraNotFoundException(id.toString());}
        return obra;
    }
}
