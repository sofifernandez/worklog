package com.worklog.backend.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.Where;

import java.sql.Timestamp;

@Entity
@Table(name = "obra", uniqueConstraints = @UniqueConstraint(columnNames = "bps"))
public class Obra {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    private Long id;
    @Size(min = 2, max = 50, message = "El nombre debe tener entre 2 y 50 caracteres")
    @Column(name = "nombre", nullable = false, length = 50)
    private String nombre;

    @Digits(integer = 20, fraction = 0, message = "El numero de BPS debe tener X digitos")
    @Column(name = "bps", nullable = false, length = 50)
    private String bps;

    @Column(name = "fecha_alta", nullable = false, length = 19)
    private Timestamp fechaAlta;

    @Column(name = "fecha_modif", length = 19)
    private Timestamp fechaModif;

    @Column(name = "activo", nullable = false)
    private Boolean activo;

    @OneToOne(mappedBy = "obra", fetch = FetchType.EAGER)
    @Where(clause = "activo = true")
    @JsonManagedReference
    private JefeObra jefeObra;

    @Column(name = "codigoQr", columnDefinition = "LONGBLOB" ,nullable = true)
    @Lob
    private byte[] codigoQR;

    public byte[] getCodigoQR() {
        return codigoQR;
    }

    public void setCodigoQR(byte[] codigoQR) {
        this.codigoQR = codigoQR;
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

    public JefeObra getJefeObra() {
        return jefeObra;
    }

    public void setJefeObra(JefeObra jefeObra) {
        this.jefeObra = jefeObra;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getBps() {
        return bps;
    }

    public void setBps(String bps) {
        this.bps = bps;
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
