package com.worklog.backend.exception;

public class PersonaRolNotFoundException extends RuntimeException{
    public PersonaRolNotFoundException(Long id) {
        super("Persona/rol no encontrada: " + id);
    }
}
