package com.dignamente.br.api.dto.MedicalRecord;

import jakarta.validation.constraints.NotBlank;

import java.util.UUID;

public record MedicalRecordRequestDTO(
        UUID appointmentId,
        @NotBlank(message = "As anotações do prontuário são obrigatórias")
        String notes,
        String diagnosis,
        String prescription
) {}
