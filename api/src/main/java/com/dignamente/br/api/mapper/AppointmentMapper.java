package com.dignamente.br.api.mapper;


import com.dignamente.br.api.dto.Appointment.AppointmentResponseDTO;
import com.dignamente.br.api.entities.Appointment;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class AppointmentMapper {
    public  AppointmentResponseDTO toDto(Appointment appointment) {
        return new AppointmentResponseDTO(
                appointment.getId(),
                appointment.getPatient().getId(),
                appointment.getPsychologist().getId(),
                appointment.getDateTime(),
                appointment.getStatus(),
                appointment.getPatient().getName(),
                appointment.getPsychologist().getName()

        );


    }

    public List<AppointmentResponseDTO> toListDto(List<Appointment> appointments) {
        return appointments.stream()
                .map(appointment -> new AppointmentResponseDTO(
                        appointment.getId(),
                        appointment.getPatient().getId(),
                        appointment.getPsychologist().getId(),
                        appointment.getDateTime(),
                        appointment.getStatus(),
                        appointment.getPatient().getName(),
                        appointment.getPsychologist().getName()
                ))
                .toList();
    }

}
