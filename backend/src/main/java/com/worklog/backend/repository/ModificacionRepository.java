package com.worklog.backend.repository;

import com.worklog.backend.model.Modificacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ModificacionRepository extends JpaRepository<Modificacion, Long> {

    @Query(value = "SELECT * FROM modificacion WHERE jornal_id = :jornalId", nativeQuery = true)
    List<Modificacion> findModificacionByJornalId(@Param("jornalId") Long jornalId);
}
