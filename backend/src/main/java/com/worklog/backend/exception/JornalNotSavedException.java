package com.worklog.backend.exception;

public class JornalNotSavedException extends RuntimeException {
    public JornalNotSavedException(String apellido){ super("Hubo un problema al guardar los datos para: " + apellido); }
}
