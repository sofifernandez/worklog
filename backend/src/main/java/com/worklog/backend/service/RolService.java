package com.worklog.backend.service;

import com.worklog.backend.model.Rol;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Collection;
import java.util.stream.Collectors;

public class RolService {

    public RolService() {
    }

    private Collection<String> getCurrentUserRoles() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            throw new IllegalStateException("No authentication found in security context");
        }

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        return authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());
    }

    public boolean isUsuarioLoggeadoAdmin () {
        Collection<String> roles = this.getCurrentUserRoles();
        return (roles.contains("ROLE_"+ Rol.ADMIN_ROL));
    }

    public boolean isUsuarioLoggeadoJefeObra () {
        Collection<String> roles = this.getCurrentUserRoles();
        return (roles.contains("ROLE_"+Rol.JO_ROL));
    }

    public boolean isUsuarioLoggeadoTrabajador () {
        Collection<String> roles = this.getCurrentUserRoles();
        return (roles.contains("ROLE_"+Rol.TRABAJADOR_ROL));
    }
}
