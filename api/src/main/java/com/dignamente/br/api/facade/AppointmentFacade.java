package com.dignamente.br.api.facade;

import com.dignamente.br.api.dto.Appointment.AppointmentRequestDTO;
import com.dignamente.br.api.dto.Appointment.AppointmentResponseDTO;
import com.dignamente.br.api.entities.User;
import com.dignamente.br.api.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

@Component
public class AppointmentFacade {

    @Autowired
    private AppointmentService appointmentService;

    public AppointmentResponseDTO createAppointment(AppointmentRequestDTO dto, User loggedUser) {
        return appointmentService.createAppointment(dto, loggedUser);
    }

    public AppointmentResponseDTO findAppointmentById(UUID id) {
        return appointmentService.findAppointmentById(id);
    }

    public List<AppointmentResponseDTO> myAppointments(User loggedUser) {
        return appointmentService.myAppointments(loggedUser);
    }

    public AppointmentResponseDTO createMeetLink(UUID id, User loggedUser) {
        return appointmentService.createMeetLink(id, loggedUser);
    }

    public void deleteAppointment(UUID id, User loggedUser) {
        appointmentService.deleteAppointment(id, loggedUser);
    }
}
