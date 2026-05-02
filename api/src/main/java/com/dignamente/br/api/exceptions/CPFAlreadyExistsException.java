package com.dignamente.br.api.exceptions;

public class CPFAlreadyExistsException extends RuntimeException {
     public CPFAlreadyExistsException(String message) {
        super(message);
    }
    
}
