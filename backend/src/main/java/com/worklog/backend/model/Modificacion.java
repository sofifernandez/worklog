package com.worklog.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;

import java.sql.Timestamp;

@Entity
@Table(name = "MODIFICACION", uniqueConstraints = @UniqueConstraint(columnNames = "id"))
public class Modificacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "jefe_id", nullable = false)
    private JefeObra jefeObra;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "jornal_id", nullable = false)
    @JsonBackReference
    private Jornal jornal;

    @Column(name = "fecha_modificacion", nullable = false, length = 19)
    private Timestamp fechaModificacion;

    @Column(name = "campo_modificado", nullable = false, length = 50)
    private String campoModificado;

    @Column(name = "valor_anterior", nullable = false, length = 50)
    private String valorAnterior;

    @Column(name = "valor_actual", nullable = false, length = 50)
    private String valorActual;

    @Column(name = "motivo", nullable = false, length = 200)
    private String motivo;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public JefeObra getJefeObra() {
        return jefeObra;
    }

    public void setJefeObra(JefeObra jefeObra) {
        this.jefeObra = jefeObra;
    }

    public Jornal getJornal() {
        return jornal;
    }

    public void setJornal(Jornal jornal) {
        this.jornal = jornal;
    }

    public Timestamp getFechaModificacion() {
        return fechaModificacion;
    }

    public void setFechaModificacion(Timestamp fechaModificacion) {
        this.fechaModificacion = fechaModificacion;
    }

    public String getCampoModificado() {
        return campoModificado;
    }

    public void setCampoModificado(String campoModificado) {
        this.campoModificado = campoModificado;
    }

    public String getValorAnterior() {
        return valorAnterior;
    }

    public void setValorAnterior(String valorAnterior) {
        this.valorAnterior = valorAnterior;
    }

    public String getValorActual() {
        return valorActual;
    }

    public void setValorActual(String valorActual) {
        this.valorActual = valorActual;
    }

    public String getMotivo() {
        return motivo;
    }

    public void setMotivo(String motivo) {
        this.motivo = motivo;
    }
}