package com.worklog.backend.exception;

public class JornalNotFoundException extends RuntimeException{

    public JornalNotFoundException(String id){ super("Jornal/es no encontrado/s " + id); }
}
