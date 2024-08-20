package com.worklog.backend.exception;

public class ObraNotFoundException extends RuntimeException {
    public ObraNotFoundException(String mensaje) {
        super(mensaje);
    }
}
