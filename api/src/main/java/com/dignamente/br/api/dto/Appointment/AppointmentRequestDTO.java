package com.dignamente.br.api.dto.Appointment;

import java.time.LocalDateTime;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonFormat;

public record AppointmentRequestDTO(
        UUID psychologistId,
        
        // Permite o formato ISO padrão que o React envia
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
        LocalDateTime dateTime
) {}