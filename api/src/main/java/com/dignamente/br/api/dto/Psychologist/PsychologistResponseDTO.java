package com.dignamente.br.api.dto.Psychologist;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public record PsychologistResponseDTO (
    UUID id,
    String name,
    String email,
    String cpf,
    String typeUser,
    String crp,
    LocalDate birthDate,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
    
) {}
