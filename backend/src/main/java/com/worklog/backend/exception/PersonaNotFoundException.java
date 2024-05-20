package com.worklog.backend.exception;

public class PersonaNotFoundException extends RuntimeException {
    public PersonaNotFoundException(Long id) {
        super("Persona no encontrada: " + id);
    }
}
