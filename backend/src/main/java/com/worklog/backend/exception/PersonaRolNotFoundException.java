package com.worklog.backend.exception;

public class PersonaRolNotFoundException extends RuntimeException{
    public PersonaRolNotFoundException(String id) {
        super("Persona/rol no encontrada: " + id);
    }
}
