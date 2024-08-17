package com.worklog.backend.repository;

import com.worklog.backend.model.Modificacion;
import com.worklog.backend.model.Obra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

import java.time.LocalDate;
import java.util.List;

public interface ModificacionRepository extends JpaRepository<Modificacion, Long> {

    @Query(value = "SELECT M FROM Modificacion M WHERE M.jornal.id = :jornalId")
    List<Modificacion> findModificacionByJornalId(@Param("jornalId") Long jornalId);

    @Query(value= "SELECT M FROM Modificacion M " +
            "WHERE M.jornal.fechaJornal >= :fechaDesde AND M.jornal.fechaJornal<= :fechaHasta AND " +
            "M.jornal.obra.id IN :obras")
    List<Modificacion> getModificacionesByFechasAndObras(@Param("fechaDesde") LocalDate fechaDesde,
                                                         @Param ("fechaHasta") LocalDate fechaHasta,
                                                         @Param("obras") List<Long> obraIds);
}
