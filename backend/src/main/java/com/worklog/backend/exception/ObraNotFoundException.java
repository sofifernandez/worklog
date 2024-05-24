package com.worklog.backend.exception;

public class ObraNotFoundException extends RuntimeException {
    public ObraNotFoundException(Long id) {
        super("Persona no encontrada: " + id);
    }
}
