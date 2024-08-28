package com.worklog.backend.repository;

import com.worklog.backend.model.Jornal;
import com.worklog.backend.model.Obra;
import com.worklog.backend.model.Persona;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public class JornalRepositoryImpl implements JornalRepositoryCustom{
    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Jornal[]> findJornalesByRangoDeFechasObraPersona(LocalDate startDate, LocalDate endDate, Obra obra, Persona persona) {
        StringBuilder sql = new StringBuilder("SELECT * FROM jornal WHERE 1=1");

        if (persona != null) {
            sql.append(" AND persona_id = :personaId");
        }

        if (startDate != null) {
            sql.append(" AND fecha_jornal >= :startDate");
        }

        if (endDate != null) {
            sql.append(" AND fecha_jornal <= :endDate");
        }

        if (obra != null) {
            sql.append(" AND obra_id = :obraId");
        }

        sql.append(" ORDER BY fecha_jornal");

        Query query = entityManager.createNativeQuery(sql.toString(), Jornal.class);

        if (persona != null) {
            query.setParameter("personaId", persona.getId());
        }

        if (startDate != null) {
            query.setParameter("startDate", startDate);
        }

        if (endDate != null) {
            query.setParameter("endDate", endDate);
        }

        if (obra != null) {
            query.setParameter("obraId", obra.getId());
        }

        List<Jornal> result = query.getResultList();
        return result.isEmpty() ? Optional.empty() : Optional.of(result.toArray(new Jornal[0]));
    }


    @Override
    public Optional<Jornal[]> findJornalesByFechaObraPersona(LocalDate fecha, Obra obra, Persona persona) {
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT * FROM jornal WHERE fecha_jornal = :fecha");
        sql.append(" AND obra_id = :obraId");
        sql.append(" AND persona_id = :personaId");
        sql.append(" AND confirmado = true");
        Query query = entityManager.createNativeQuery(sql.toString(), Jornal.class);

        query.setParameter("personaId", persona.getId());
        query.setParameter("fecha", fecha);
        query.setParameter("obraId", obra.getId());
        List<Jornal> result = query.getResultList();
        return result.isEmpty() ? Optional.empty() : Optional.of(result.toArray(new Jornal[0]));
    }

    @Override
    public Optional<Jornal[]> findJornalesByFechasObrasyPersonas(LocalDate startDate, LocalDate endDate, List<Long> obrasID, List<Long> personasID) {
        StringBuilder sql = new StringBuilder("SELECT * FROM jornal WHERE ");

        sql.append(" fecha_jornal >= :startDate");
        sql.append(" AND fecha_jornal <= :endDate");

        if (personasID != null && !personasID.isEmpty()) {
            sql.append(" AND persona_id IN (:personasID)");
        }

        if (obrasID != null && !obrasID.isEmpty()) {
            sql.append(" AND obra_id IN (:obrasID)");
        }

        sql.append(" ORDER BY fecha_jornal DESC, hora_comienzo DESC");

        Query query = entityManager.createNativeQuery(sql.toString(), Jornal.class);
        query.setParameter("startDate", startDate);
        query.setParameter("endDate", endDate);

        if (personasID != null && !personasID.isEmpty()) {
            query.setParameter("personasID", personasID);
        }

        if (obrasID != null && !obrasID.isEmpty()) {
            query.setParameter("obrasID", obrasID);
        }

        List<Jornal> result = query.getResultList();
        return result.isEmpty() ? Optional.empty() : Optional.of(result.toArray(new Jornal[0]));
    }


}
