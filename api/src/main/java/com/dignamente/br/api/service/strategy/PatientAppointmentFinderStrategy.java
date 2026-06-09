package com.dignamente.br.api.service.strategy;

import java.util.List;

import org.springframework.stereotype.Component;

import com.dignamente.br.api.entities.Appointment;
import com.dignamente.br.api.entities.User;
import com.dignamente.br.api.repository.AppointmentRepository;

import lombok.RequiredArgsConstructor;


@Component
@RequiredArgsConstructor
public class PatientAppointmentFinderStrategy implements AppointmentFinderStrategy {

    private final AppointmentRepository appointmentRepository;

    public List<Appointment> find(User user) {
        return appointmentRepository.findAppointmentsByPatientId(user.getId());
    } 

} 

