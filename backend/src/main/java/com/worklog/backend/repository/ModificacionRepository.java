package com.worklog.backend.repository;

import com.worklog.backend.model.Modificacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ModificacionRepository extends JpaRepository<Modificacion, Long> {

    @Query(value = "SELECT * FROM MODIFICACION WHERE jornal_id = :jornalId", nativeQuery = true)
    Modificacion findModificacionByJornalId(@Param("jornalId") Long jornalId);
}
