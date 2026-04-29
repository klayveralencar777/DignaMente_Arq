package com.dignamente.br.api.controller;

import com.dignamente.br.api.dto.Appointment.AppointmentRequestDTO;
import com.dignamente.br.api.entities.Appointment;
import com.dignamente.br.api.service.AppointmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PostMapping
    public ResponseEntity<Appointment> schedule(@RequestBody AppointmentRequestDTO dto) {
        return ResponseEntity.ok(appointmentService.schedule(dto));
    }
}