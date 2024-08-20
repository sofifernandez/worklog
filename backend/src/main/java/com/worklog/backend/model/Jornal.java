package com.worklog.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.sql.Timestamp;
import java.time.LocalDate;

@Entity
@Table(name = "jornal", uniqueConstraints = @UniqueConstraint(columnNames = "id"))
public class Jornal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "persona_id", nullable = false)
    private Persona persona;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "obra_id", nullable = false)
    private Obra obra;

    @Column(name = "fecha_jornal", nullable = false, length = 19)
    private LocalDate fechaJornal;

    @Column(name = "hora_comienzo", nullable = false, length = 19)
    private Timestamp horaComienzo;

    @Column(name = "hora_fin", length = 19)
    private Timestamp horaFin;

    @Column(name = "modificado", nullable = false)
    private Boolean modificado;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "tipo_jornal", nullable = false)
    private TipoJornal tipoJornal;

    @Column(name = "confirmado", nullable = false)
    private Boolean confirmado;


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

    public LocalDate getFechaJornal() {
        return fechaJornal;
    }

    public void setFechaJornal(LocalDate fechaJornal) {
        this.fechaJornal = fechaJornal;
    }

    public Timestamp getHoraComienzo() {
        return horaComienzo;
    }

    public void setHoraComienzo(Timestamp horaComienzo) { this.horaComienzo = horaComienzo; }

    public Timestamp getHoraFin() {
        return horaFin;
    }

    public void setHoraFin(Timestamp horaFin) { this.horaFin = horaFin; }

    public Boolean getModificado() { return modificado; }

    public void setModificado(Boolean modificado) { this.modificado = modificado; }

    public TipoJornal getTipoJornal() {
        return tipoJornal;
    }

    public void setTipoJornal(TipoJornal tipoJornal) {
        this.tipoJornal = tipoJornal;
    }

    public Boolean getConfirmado() {
        return confirmado;
    }

    public void setConfirmado(Boolean confirmado) {
        this.confirmado = confirmado;
    }
}
