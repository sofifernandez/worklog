package com.worklog.backend.model;


import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
@Table(name = "USUARIO", uniqueConstraints = @UniqueConstraint(columnNames = "username"))
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "persona_id",unique = true, nullable = false)
    private Persona persona;

    @Column(name = "username", unique = true, nullable = false, length = 26)
    private String username;

    @Column(name = "password", nullable = false)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    @Column(name = "password_reset", nullable = false)
    private boolean passwordResetRequired;

    public boolean isPasswordResetRequired() {
        return passwordResetRequired;
    }

    public void setPasswordResetRequired(boolean passwordResetRequired) {
        this.passwordResetRequired = passwordResetRequired;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Persona getPersona() {
        return persona;
    }

    public void setPersona(Persona persona) {
        this.persona = persona;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
