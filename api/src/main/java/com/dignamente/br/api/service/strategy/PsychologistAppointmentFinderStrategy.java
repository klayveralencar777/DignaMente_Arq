package com.dignamente.br.api.service.strategy;

import java.util.List;

import org.springframework.stereotype.Component;

import com.dignamente.br.api.entities.Appointment;
import com.dignamente.br.api.entities.User;
import com.dignamente.br.api.repository.AppointmentRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class PsychologistAppointmentFinderStrategy implements AppointmentFinderStrategy {

      private final AppointmentRepository repository;

    @Override
    public List<Appointment> find(User user) {

        return repository
                .findAppointmentsByPsychologistId(user.getId());
    }

    
}
