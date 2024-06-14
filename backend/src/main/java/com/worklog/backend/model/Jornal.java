package com.worklog.backend.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.Where;
import java.sql.Timestamp;

@Entity
@Table(name = "JORNAL", uniqueConstraints = @UniqueConstraint(columnNames = "id"))
public class Jornal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    private Long id;

    @Column(name = "fecha_jornal", nullable = false, length = 19)
    private Timestamp fechaJornal;

    @Column(name = "hora_comienzo", nullable = false, length = 19)
    private Timestamp horaComienzo;

    @Column(name = "hora_fin", length = 19)
    private Timestamp horaFin;

    @Column(name = "modificado", nullable = false)
    private Boolean modificado;

    @OneToOne(mappedBy = "obra", fetch = FetchType.EAGER)
    @Where(clause = "activo = true")
    @JsonManagedReference



    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }





    public Timestamp getFechaJornal() {
        return fechaJornal;
    }

    public void setFechaJornal(Timestamp fechaJornal) {
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

    public void setModificado(Boolean activo) { this.modificado = activo; }

}
