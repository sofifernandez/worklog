package com.worklog.backend.dto;

import com.worklog.backend.model.Obra;
import com.worklog.backend.model.Persona;
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

    public void transformarHoras(){
        DayOfWeek dayOfWeek = fechaJornal.getDayOfWeek();

        //CALCULAR HORAS EXTRA
        double horasExtraTemp;
        if (dayOfWeek.equals(DayOfWeek.FRIDAY)){
            horasExtraTemp=horasComun- DateTimeUtil.FRIDAY_WH;
        } else {
            horasExtraTemp=horasComun- DateTimeUtil.MONDAY_TO_THURSDAY_WH;
        }
        if (horasExtraTemp>=1){
            this.horasExtra=horasExtraTemp;
            this.horasComun= this.horasComun- this.horasExtra;
        }
        //HORAS LLUVIA
        if(horasLluvia>=1){
            this.horasComun= this.horasComun-this.horasLluvia;
        }

    }
}


