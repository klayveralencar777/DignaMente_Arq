package com.dignamente.br.api.dto.PsychologistRequestRegistration;


import java.util.UUID;

import com.dignamente.br.api.enums.RegistrationStatus;

public record RegistrationResponseDTO(
        UUID id,
        String name,
        String email,
        RegistrationStatus status

){
    
}
