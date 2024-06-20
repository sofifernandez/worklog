package com.worklog.backend.exception;

public class ObraNotFoundException extends RuntimeException {
    public ObraNotFoundException(String id) {
        super("Obra no encontrada: " + id);
    }
}
