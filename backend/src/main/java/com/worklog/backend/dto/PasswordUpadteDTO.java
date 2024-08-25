package com.worklog.backend.dto;

public class PasswordUpadteDTO {
    private long personaId;
    private String newPassword;

    // Getters y setters
    public long getPersonaId() {
        return personaId;
    }

    public void setPersonaId(long personaId) {
        this.personaId = personaId;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}
