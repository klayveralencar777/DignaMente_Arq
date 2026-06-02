package com.dignamente.br.api.exceptions;


import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.server.ResponseStatusException;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<String> handleNotFound(EntityNotFoundException ex) {
         return ResponseEntity.status(404).body(ex.getMessage());
    }

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<String> handleEmailAlreadyExists(EmailAlreadyExistsException ex) {
        return ResponseEntity.status(409).body(ex.getMessage());
    }

    @ExceptionHandler(IncorrectPasswordException.class)
    public ResponseEntity<String> handleIncorrectPassword(IncorrectPasswordException ex) {
        return ResponseEntity.status(401).body(ex.getMessage());    
    }

    @ExceptionHandler(CPFAlreadyExistsException.class)
    public ResponseEntity<String> handleCpfAlreadyExists(CPFAlreadyExistsException ex) {
        return ResponseEntity.status(409).body(ex.getMessage());
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<String> handleResponseStatus(ResponseStatusException ex) {
        return ResponseEntity.status(ex.getStatusCode()).body(ex.getReason());
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<String> handleMaxUploadSize(MaxUploadSizeExceededException ex) {
        return ResponseEntity.status(413).body("Arquivo deve ter no máximo 5MB.");
    }

}
