package com.worklog.backend.exception;

public class PersonaRolNotFoundException extends RuntimeException{
    public PersonaRolNotFoundException(String id) {
        super("No se encontró rol para la persona: " + id);
    }
}
