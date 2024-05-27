package com.worklog.backend.exception;

public class UsuarioNotFoundException extends RuntimeException{

    public UsuarioNotFoundException(Long id){ super("Usuario no encontrado: " + id); }
}
