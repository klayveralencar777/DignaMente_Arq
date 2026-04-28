package com.dignamente.br.api.dto.Appointment;

import java.time.LocalDateTime;
import java.util.UUID;

public record AppointmentRequestDTO(
        UUID patientId,
        UUID psychologistId,
        LocalDateTime scheduleAt
) {}