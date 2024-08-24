package com.worklog.backend.repository;

import com.worklog.backend.model.Obra;
import com.worklog.backend.model.Persona;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ObraRepository extends JpaRepository<Obra,Long> {

    Obra findByBps(String bps);

    @Query(value= "SELECT o FROM Obra o WHERE o.nombre LIKE :nombrePattern ")
    List<Obra> getObrasByNombre(@Param("nombrePattern") String nombrePattern);

}
