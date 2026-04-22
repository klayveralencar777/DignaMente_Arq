package com.dignamente.br.api.dto.Patient;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

import com.dignamente.br.api.enums.TypeUser;

public record PatientResponseDTO (
    UUID id,
    String name,
    String email,
    String cpf,
    TypeUser typeUser,
    String cardSus,
    LocalDate birthDate,
    LocalDateTime createdAt,
    LocalDateTime updateAt
    
) {}
    
    
