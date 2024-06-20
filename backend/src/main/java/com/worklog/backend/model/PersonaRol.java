package com.worklog.backend.model;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "PERSONA_ROL", uniqueConstraints = @UniqueConstraint(columnNames = {"persona_id", "rol_id", "activo"}))
public class PersonaRol {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "rol_id")
    private Rol rol;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "persona_id")
    @JsonBackReference
    private Persona persona;

    @Column(name = "fecha_alta", nullable = false, length = 19)
    private Timestamp fechaAlta;

    @Column(name = "fecha_modif", length = 19)
    private Timestamp fechaModif;

    @Column(name = "activo", nullable = false)
    private Boolean activo;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Rol getRol() {
        return rol;
    }

    public void setRol(Rol rol) {
        this.rol = rol;
    }

    public Persona getPersona() {
        return persona;
    }

    public void setPersona(Persona persona) {
        this.persona = persona;
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
