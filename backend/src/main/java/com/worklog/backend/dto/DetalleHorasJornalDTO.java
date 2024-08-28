package com.worklog.backend.dto;

import com.worklog.backend.model.Jornal;
import com.worklog.backend.model.Obra;
import com.worklog.backend.model.Persona;
import com.worklog.backend.service.JornalService;
import com.worklog.backend.util.DateTimeUtil;

import java.time.DayOfWeek;
import java.time.LocalDate;

public class DetalleHorasJornalDTO {
    private Persona persona;
    private Obra obra;
    private LocalDate fechaJornal;
    private double horasComun;
    private double horasLluvia;
    private double horasExtra;

    public DetalleHorasJornalDTO() {
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

    public double getHorasComun() {
        return horasComun;
    }

    public void setHorasComun(double horasComun) {
        this.horasComun = horasComun;
    }

    public double getHorasLluvia() {
        return horasLluvia;
    }

    public void setHorasLluvia(double horasLluvia) {
        this.horasLluvia = horasLluvia;
    }

    public double getHorasExtra() {
        return horasExtra;
    }

    public void setHorasExtra(double horasExtra) {
        this.horasExtra = horasExtra;
    }


    public void transformarHoras() {
        double horasNormalesDia = obtenerHorasNormalesDia(fechaJornal);

        if (this.horasComun >= horasNormalesDia) {
            this.horasExtra += this.horasComun - horasNormalesDia;
            this.horasComun = Math.max(horasNormalesDia- this.horasLluvia, 0);
        }
    }
    
    private double obtenerHorasNormalesDia(LocalDate date) {
        return date.getDayOfWeek() == DayOfWeek.FRIDAY ? DateTimeUtil.FRIDAY_WH : DateTimeUtil.MONDAY_TO_THURSDAY_WH;
    }

}


