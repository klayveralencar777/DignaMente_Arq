package com.dignamente.br.api.exceptions;

public class IncorrectPasswordException extends RuntimeException{

    public IncorrectPasswordException(String message) {
            super(message);
    }
    
}
