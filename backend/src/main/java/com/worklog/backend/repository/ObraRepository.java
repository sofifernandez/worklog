package com.worklog.backend.repository;

import com.worklog.backend.model.Obra;
import com.worklog.backend.model.JefeObra;
import com.worklog.backend.model.Persona;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ObraRepository extends JpaRepository<Obra,Long> {

    Obra findByBps(String bps);

    @Query(value = "SELECT JO.obra FROM JefeObra JO WHERE JO.persona = :persona")
    Obra getObraByJefe(@Param("persona") Persona persona);
}
