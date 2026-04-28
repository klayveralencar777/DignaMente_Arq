package com.dignamente.br.api.repository;

import com.dignamente.br.api.entities.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.UUID;

public interface AppointmentRepository extends JpaRepository<Appointment, UUID> {

    boolean existsByPsychologistIdAndScheduleAt(
            UUID psychologistId,
            LocalDateTime scheduleAt
    );
}