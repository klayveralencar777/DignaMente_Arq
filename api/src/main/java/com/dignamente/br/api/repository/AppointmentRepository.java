package com.dignamente.br.api.repository;

import com.dignamente.br.api.entities.Appointment;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, UUID> {
    List<Appointment> findAppointmentsByPatientId(UUID patientId);
    List<Appointment> findAppointmentsByPsychologistId(UUID psychologistId);
}