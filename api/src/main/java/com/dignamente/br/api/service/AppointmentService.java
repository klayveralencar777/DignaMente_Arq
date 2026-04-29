package com.dignamente.br.api.service;

import com.dignamente.br.api.dto.Appointment.AppointmentRequestDTO;
import com.dignamente.br.api.entities.Appointment;
import com.dignamente.br.api.entities.Patient;
import com.dignamente.br.api.entities.Psychologist;
import com.dignamente.br.api.enums.AppointmentStatus;
import com.dignamente.br.api.repository.AppointmentRepository;
import com.dignamente.br.api.repository.PatientRepository;
import com.dignamente.br.api.repository.PsychologistRepository;
import org.springframework.stereotype.Service;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final PsychologistRepository psychologistRepository;

    public AppointmentService(
            AppointmentRepository appointmentRepository,
            PatientRepository patientRepository,
            PsychologistRepository psychologistRepository) {
        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
        this.psychologistRepository = psychologistRepository;
    }

    public Appointment schedule(AppointmentRequestDTO dto) {

        Patient patient = patientRepository.findById(dto.patientId())
                .orElseThrow(() -> new RuntimeException("Paciente não encontrado"));

        Psychologist psychologist = psychologistRepository.findById(dto.psychologistId())
                .orElseThrow(() -> new RuntimeException("Psicólogo não encontrado"));

        boolean exists = appointmentRepository.existsByPsychologistIdAndScheduleAt(
                dto.psychologistId(),
                dto.scheduleAt());

        if (exists) {
            throw new RuntimeException("Horário já ocupado");
        }

        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setPsychologist(psychologist);
        appointment.setScheduleAt(dto.scheduleAt());
        appointment.setStatus(AppointmentStatus.SCHEDULED);

        return appointmentRepository.save(appointment);
    }
}