package com.worklog.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "TIPO_JORNAL", uniqueConstraints = @UniqueConstraint(columnNames = "id"))
public class TipoJornal {

    @Transient
    public static final Long ID_JORNAL_COMUN = 1L;
    @Transient
    public static final Long ID_JORNAL_LLUVIA = 2L;
    @Transient
    public static final Long ID_JORNAL_EXTRA = 3L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    private Long id;

    @Column(name = "tipo_jornal", nullable = false, length = 6)
    private String tipoJornal;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTipoJornal() {
        return tipoJornal;
    }

    public void setTipoJornal(String tipoJornal) {
        this.tipoJornal = tipoJornal;
    }

}
