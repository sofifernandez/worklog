package com.worklog.backend.repository;

import com.worklog.backend.model.Obra;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ObraRepository extends JpaRepository<Obra,Long> {

    Obra findByBps(String bps);
}
