package com.dignamente.br.api.service.strategy;

import java.util.List;

import com.dignamente.br.api.entities.Appointment;
import com.dignamente.br.api.entities.User;

public interface  AppointmentFinderStrategy {
    List<Appointment> find(User user);

    
}
