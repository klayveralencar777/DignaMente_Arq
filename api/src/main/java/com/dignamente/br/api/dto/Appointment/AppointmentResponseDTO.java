package com.dignamente.br.api.dto.Appointment;

import java.time.LocalDateTime;
import java.util.UUID;

import com.dignamente.br.api.enums.AppointmentStatus;

public record AppointmentResponseDTO (
    UUID id,
    UUID patientId,
    UUID psychologistId,
    LocalDateTime dateTime,
    AppointmentStatus status,
    String patientName,
    String psychologistName
){
    
    
}
