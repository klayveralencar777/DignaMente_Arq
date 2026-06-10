package com.dignamente.br.api.controller;

import com.dignamente.br.api.dto.Appointment.AppointmentRequestDTO;
import com.dignamente.br.api.dto.Appointment.AppointmentResponseDTO;

import com.dignamente.br.api.entities.User;
import com.dignamente.br.api.facade.AppointmentFacade;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentFacade appointmentFacade;

    @PostMapping
    public ResponseEntity<AppointmentResponseDTO> createAppointment(
            @RequestBody AppointmentRequestDTO dto,
            @AuthenticationPrincipal User loggedUser) {

        AppointmentResponseDTO appointment = appointmentFacade.createAppointment(dto, loggedUser);
        return ResponseEntity.status(201).body(appointment);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AppointmentResponseDTO> findAppointmentById(@PathVariable UUID id) {
        AppointmentResponseDTO appointment = appointmentFacade.findAppointmentById(id);
        return ResponseEntity.ok(appointment);
    }

    @GetMapping("/me")
    public ResponseEntity<List<AppointmentResponseDTO>> myAppointments(@AuthenticationPrincipal User loggedUser) {
        return ResponseEntity.ok(appointmentFacade.myAppointments(loggedUser));
    }

    @PostMapping("/{id}/meet")
    public ResponseEntity<AppointmentResponseDTO> createMeetLink(
            @PathVariable UUID id,
            @AuthenticationPrincipal User loggedUser) {

        AppointmentResponseDTO appointment = appointmentFacade.createMeetLink(id, loggedUser);
        return ResponseEntity.ok(appointment);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable UUID id, @AuthenticationPrincipal User loggedUser) {
        appointmentFacade.deleteAppointment(id, loggedUser);
        return ResponseEntity.noContent().build();
    }
}
