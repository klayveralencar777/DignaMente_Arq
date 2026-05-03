package com.dignamente.br.api.controller;

import com.dignamente.br.api.dto.Appointment.AppointmentRequestDTO;
import com.dignamente.br.api.dto.Appointment.AppointmentResponseDTO;
import com.dignamente.br.api.entities.Appointment;
import com.dignamente.br.api.entities.User;
import com.dignamente.br.api.service.AppointmentService;

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
    private AppointmentService appointmentService;

    @PostMapping
    public ResponseEntity<AppointmentResponseDTO> createAppointment(
        @RequestBody AppointmentRequestDTO dto, 
        @AuthenticationPrincipal User loggedUser) 
    {

        AppointmentResponseDTO appointment = appointmentService.createAppointment(dto, loggedUser);
        return ResponseEntity.status(201).body(appointment);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AppointmentResponseDTO> findAppointmentById(@PathVariable UUID id) {
        AppointmentResponseDTO appointment = appointmentService.findAppointmentById(id);
        return ResponseEntity.ok(appointment);
    }

    @GetMapping
    public ResponseEntity<List<Appointment>> findAll(@AuthenticationPrincipal User loggedUser) {
        return ResponseEntity.ok(appointmentService.findAll(loggedUser));
    }

    @GetMapping("/me")
    public ResponseEntity<List<Appointment>> myAppointments(@AuthenticationPrincipal User loggedUser) {
        return ResponseEntity.ok(appointmentService.myAppointments(loggedUser));
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable UUID id, @AuthenticationPrincipal User loggedUser) {
        appointmentService.deleteAppointment(id, loggedUser);
        return ResponseEntity.noContent().build();
    }
}