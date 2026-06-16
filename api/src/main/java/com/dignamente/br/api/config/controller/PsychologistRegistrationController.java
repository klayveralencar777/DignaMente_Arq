package com.dignamente.br.api.config.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dignamente.br.api.dto.PsychologistRequestRegistration.RegistrationRequestDTO;
import com.dignamente.br.api.dto.PsychologistRequestRegistration.RegistrationResponseDTO;
import com.dignamente.br.api.entities.PsychologistRegistrationRequest;
import com.dignamente.br.api.service.RegistrationRequestService;

@RestController
@RequestMapping("/psychologists-registration")
public class PsychologistRegistrationController {

    
private final RegistrationRequestService service;

    public PsychologistRegistrationController(RegistrationRequestService service) {
        this.service = service;

    }


    @PostMapping("")
    public ResponseEntity<RegistrationResponseDTO> create(
            @ModelAttribute RegistrationRequestDTO dto
    ) {

        PsychologistRegistrationRequest request = service.create(dto);

        return ResponseEntity.ok(
                new RegistrationResponseDTO(
                        request.getId(),
                        request.getName(),
                        request.getEmail(),
                        request.getStatus()
                )
        );
    }
   
}