package com.worklog.backend.repository;

import com.worklog.backend.model.Jornal;
import com.worklog.backend.model.Obra;
import com.worklog.backend.model.Persona;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

@Repository
public class JornalRepositoryImpl implements JornalRepositoryCustom{
    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Jornal[]> findJornalesByFiltros(Timestamp startDate, Timestamp endDate, Obra obra, Persona persona) {
        StringBuilder sql = new StringBuilder("SELECT * FROM JORNAL WHERE 1=1");

        if (persona != null) {
            sql.append(" AND persona_id = :personaId");
        }

        if (startDate != null) {
            sql.append(" AND fecha_jornal >= :startDate");
        }

        if (endDate != null) {
            sql.append(" AND fecha_jornal < :endDate");
        }

        if (obra != null) {
            sql.append(" AND obra_id = :obraId");
        }

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

}
