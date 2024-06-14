package com.worklog.backend.service;

import com.worklog.backend.repository.PersonaRepository;
import com.worklog.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UsuarioRepository usuarioRepository;
}
