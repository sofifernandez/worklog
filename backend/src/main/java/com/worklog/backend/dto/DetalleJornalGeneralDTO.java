package com.worklog.backend.dto;


import com.worklog.backend.model.Persona;

import java.time.LocalDate;
import java.util.List;

public class DetalleJornalGeneralDTO {
    private Persona persona;
    private LocalDate fechaJornal;
    private double horasComunes;
    private double horasLluvias;
    private double horasExtras;
    private List<LocalDate> faltas;

    public List<LocalDate> getFaltas() {
        return faltas;
    }

    public void setFaltas(List<LocalDate> faltas) {
        this.faltas = faltas;
    }

    // Constructor vacío
    public DetalleJornalGeneralDTO() {
    }

    // Getters y Setters
    public Persona getPersona() {
        return persona;
    }

    public void setPersona(Persona persona) {
        this.persona = persona;
    }

    public LocalDate getFechaJornal() {
        return fechaJornal;
    }

    public void setFechaJornal(LocalDate fechaJornal) {
        this.fechaJornal = fechaJornal;
    }

    public double getHorasComunes() {
        return horasComunes;
    }

    public void setHorasComunes(double horasComunes) {
        this.horasComunes = horasComunes;
    }

    public double getHorasLluvias() {
        return horasLluvias;
    }

    public void setHorasLluvias(double horasLluvias) {
        this.horasLluvias = horasLluvias;
    }

    public double getHorasExtras() {
        return horasExtras;
    }

    public void setHorasExtras(double horasExtras) {
        this.horasExtras = horasExtras;
    }


    @Override
    public String toString() {
        return "DetalleJornalGeneralDTO{" +
                "persona=" + persona +
                ", fechaJornal=" + fechaJornal +
                ", horasComunes=" + horasComunes +
                ", horasLluvias=" + horasLluvias +
                ", horasExtras=" + horasExtras +
                ", faltas=" + faltas.toString() +
                '}';
    }
}