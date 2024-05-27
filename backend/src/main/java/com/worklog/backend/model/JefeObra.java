package com.worklog.backend.model;

import jakarta.persistence.*;

import java.sql.Timestamp;

@Entity
@Table(name = "JEFE_OBRA", uniqueConstraints = @UniqueConstraint(columnNames = {"persona_id", "obra_id", "activo"}))
public class JefeObra {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "persona_id")
    private Persona persona;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "obra_id")
    private Obra obra;

    @Column(name = "fecha_alta", nullable = false, length = 19)
    private Timestamp fechaAlta;

    @Column(name = "fecha_modif", nullable = false, length = 19)
    private Timestamp fechaModif;

    @Column(name = "activo", nullable = false)
    private Boolean activo;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Persona getPersona() {
        return persona;
    }

    public void setPersona(Persona persona) {
        this.persona = persona;
    }

    public Obra getObra() {
        return obra;
    }

    public void setObra(Obra obra) {
        this.obra = obra;
    }

    public Timestamp getFechaAlta() {
        return fechaAlta;
    }

    public void setFechaAlta(Timestamp fechaAlta) {
        this.fechaAlta = fechaAlta;
    }

    public Timestamp getFechaModif() {
        return fechaModif;
    }

    public void setFechaModif(Timestamp fechaModif) {
        this.fechaModif = fechaModif;
    }

    public Boolean getActivo() {
        return activo;
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }
}