package com.worklog.backend.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.Where;

import java.sql.Date;
import java.sql.Timestamp;
import java.util.List;

@Entity
@Table(name = "persona", uniqueConstraints = @UniqueConstraint(columnNames = "ci"))

public class Persona {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    private Long id;

    @Column(name = "nombre", nullable = false, length = 50)
    @Size(min = 2, max = 30, message = "El nombre debe tener entre 2 y 30 caracteres")
    private String nombre;

    @Size(min = 2, max = 30, message = "El apellido debe tener entre 2 y 30 caracteres")
    @Column(name = "apellido", nullable = false, length = 50)
    private String apellido;

    @Column(name = "ci", unique = true, nullable = false, length = 26)
    @Pattern(regexp = "\\d{8}", message = "La cédula debe tener exactamente 8 números")
    private String ci;

    @Column(name = "fecha_nacimiento", length = 10)
    private Date fechaNacimiento;

    @Digits(integer = 10, fraction = 0, message = "El teléfono solo debe contener hasta 9 dígitos")
    @Column(name = "numero_telefono", length = 15)
    private String numeroTelefono;

    @Column(name = "fecha_alta", nullable = false, length = 19)
    private Timestamp fechaAlta;

    @Column(name = "fecha_modif", nullable = true, length = 19)
    private Timestamp fechaModif;

    @Column(name = "activo", nullable = false)
    private Boolean activo;

    @OneToOne(mappedBy = "persona", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JsonManagedReference
    private PersonaRol personaRol;

    public Persona() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public String getCi() {
        return ci;
    }

    public void setCi(String ci) {
        this.ci = ci;
    }

    public Date getFechaNacimiento() {
        return fechaNacimiento;
    }

    public void setFechaNacimiento(Date fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }

    public String getNumeroTelefono() {
        return numeroTelefono;
    }

    public void setNumeroTelefono(String numeroTelefono) {
        this.numeroTelefono = numeroTelefono;
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

    @Override
    public boolean equals(Object obj) {
        return this.id.equals(((Persona)obj).getId());
    }

    public PersonaRol getPersonaRol() {
        return personaRol;
    }

    public void setPersonaRol(PersonaRol personaRol) {
        this.personaRol = personaRol;
    }
}
