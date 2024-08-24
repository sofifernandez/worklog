package com.worklog.backend.exception;

public class PersonaNotFoundException extends RuntimeException {
    public PersonaNotFoundException(String id) {
        super("Persona no encontrada");
    }
}
