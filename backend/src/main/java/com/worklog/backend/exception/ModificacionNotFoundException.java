package com.worklog.backend.exception;

public class ModificacionNotFoundException extends RuntimeException {

    public ModificacionNotFoundException(String parametro) { super("Modificacion no encontrada: " + parametro); }
}
