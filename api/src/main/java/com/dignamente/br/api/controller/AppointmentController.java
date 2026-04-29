package com.dignamente.br.api.controller;

import com.dignamente.br.api.dto.Appointment.AppointmentRequestDTO;
import com.dignamente.br.api.entities.Appointment;
import com.dignamente.br.api.service.AppointmentService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @PostMapping
    public ResponseEntity<Appointment> create(@RequestBody AppointmentRequestDTO dto) {
        Appointment appointment = appointmentService.create(dto);
        return ResponseEntity.status(201).body(appointment);
    }

    @GetMapping
    public ResponseEntity<List<Appointment>> findAll() {
        return ResponseEntity.ok(appointmentService.findAll());
    }
}