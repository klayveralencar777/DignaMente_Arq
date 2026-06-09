package com.dignamente.br.api.exceptions;

public class GoogleMeetException extends RuntimeException {

    public GoogleMeetException(String message) {
        super(message);
    }

    public GoogleMeetException(String message, Throwable cause) {
        super(message, cause);
    }
}
