package com.worklog.backend.exception;

public class JornalNotFoundException extends RuntimeException{

    public JornalNotFoundException(Long id){ super("Jornal no encontrado: " + id); }
}
