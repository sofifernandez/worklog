package com.worklog.backend.model;

import jakarta.persistence.*;

import java.sql.Timestamp;

@Entity
@Table(name = "ROL", uniqueConstraints = @UniqueConstraint(columnNames = "id"))
public class Rol {

    @Transient
    public static final Long ID_ROL_ADMIN = 1L;
    @Transient
    public static final Long ID_ROL_TRA = 3L;
    @Transient
    public static final Long ID_ROL_JO = 2L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    private Long id;

    @Column(name = "rol", nullable = false, length = 15)
    private String rol;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }
}
