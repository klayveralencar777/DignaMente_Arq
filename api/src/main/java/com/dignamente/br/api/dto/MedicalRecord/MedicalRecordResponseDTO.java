package com.dignamente.br.api.dto.MedicalRecord;

import java.time.LocalDateTime;
import java.util.UUID;

public record MedicalRecordResponseDTO(
        UUID id,
        UUID appointmentId,
        UUID patientId,
        String patientName,
        UUID psychologistId,
        String psychologistName,
        String notes,
        String diagnosis,
        String prescription,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}