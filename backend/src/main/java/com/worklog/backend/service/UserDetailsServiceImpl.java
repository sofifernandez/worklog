package com.worklog.backend.service;

import com.worklog.backend.exception.PersonaNotFoundException;
import com.worklog.backend.exception.PersonaRolNotFoundException;
import com.worklog.backend.repository.PersonaRolRepository;
import com.worklog.backend.repository.UsuarioRepository;
import com.worklog.backend.model.Usuario;
import com.worklog.backend.model.Persona;
import com.worklog.backend.model.Rol;
import com.worklog.backend.model.PersonaRol;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import javax.management.relation.RoleNotFoundException;
import java.util.Collection;
import java.util.Collections;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PersonaRolRepository personaRolRepository;


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("El usuario " + username + " no existe"));

        PersonaRol personaRol = personaRolRepository.findByPersona(usuario.getPersona())
                .orElseThrow(() -> new PersonaRolNotFoundException(usuario.getPersona().getNombre() + ' ' + usuario.getPersona().getApellido()));

        String rolStr = "ROLE_".concat(personaRol.getRol().getRol());

        SimpleGrantedAuthority simpleGrantedAuthority = new SimpleGrantedAuthority(rolStr);

        //System.out.println(rolStr);

        return new User(usuario.getUsername(), usuario.getPassword(), true,true,true,true, Collections.singleton(simpleGrantedAuthority));
    }
}
