package com.worklog.backend.exception;

public class JefeObraNotFoundException extends RuntimeException{
    public JefeObraNotFoundException(Long id){ super("Jefe de obra no encontrado: " +id);};
}
