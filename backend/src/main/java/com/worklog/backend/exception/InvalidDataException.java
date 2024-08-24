package com.worklog.backend.exception;

import lombok.Getter;

public class InvalidDataException extends RuntimeException {

    @Getter
    private String fieldName;
    @Getter
    private String fieldMessage;

    public InvalidDataException(String message) {
        super(message);
    }

    public InvalidDataException(String message, Throwable cause) {
        super(message, cause);
    }

    public InvalidDataException(String fieldName, String message) {
        super(message);
        this.fieldName = fieldName;
        this.fieldMessage = message;
    }

}
