package com.dignamente.br.api.service;

import com.dignamente.br.api.dto.Appointment.AppointmentRequestDTO;
import com.dignamente.br.api.entities.Appointment;
import com.dignamente.br.api.entities.Patient;
import com.dignamente.br.api.entities.Psychologist;
import com.dignamente.br.api.entities.User;
import com.dignamente.br.api.enums.AppointmentStatus;
import com.dignamente.br.api.enums.TypeUser;
import com.dignamente.br.api.exceptions.EntityNotFoundException;
import com.dignamente.br.api.repository.AppointmentRepository;
import com.dignamente.br.api.repository.PatientRepository;
import com.dignamente.br.api.repository.PsychologistRepository;

import org.springframework.http.HttpStatus;

import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
public class AppointmentService {

    
    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final PsychologistRepository psychologistRepository;

    public AppointmentService(
        AppointmentRepository appointmentRepository,
        PatientRepository patientRepository,
        PsychologistRepository psychologistRepository)
    {
            this.appointmentRepository = appointmentRepository;
            this.patientRepository = patientRepository;
            this.psychologistRepository = psychologistRepository;
    }

      public List<Appointment> findAll(User loggedUser) {
        if(loggedUser == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário não autenticado!");
        }
        
        if(loggedUser.getTypeUser() != TypeUser.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Somente admins podem visualizar todas as consultas");

        }
        return appointmentRepository.findAll();
    }

    public List<Appointment> myAppointments(User loggedUser) {
        if(loggedUser == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário não autenticado!");
    
        }

        if(loggedUser.getTypeUser()  == TypeUser.PATIENT ) {
            return appointmentRepository.findAppointmentsByPatientId(loggedUser.getId());
        }
        else if(loggedUser.getTypeUser() == TypeUser.PSYCHOLOGIST) {
            return appointmentRepository.findAppointmentsByPsychologistId(loggedUser.getId());
        }
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Tipo de usuário inválido.");

    }

    public Appointment findAppointmentById(UUID id) {
        return appointmentRepository.findById(id).orElseThrow(() -> 
            new EntityNotFoundException("Consulta não encontrada com o ID "+ id));
    }

    public Appointment createAppointment(AppointmentRequestDTO dto, User loggedUser) {
        if(loggedUser == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário não autenticado!");
        }
      
        if(loggedUser.getTypeUser() != TypeUser.PATIENT) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Somente pacientes agendam consultas..");
        }
        Patient patient = patientRepository.findById(loggedUser.getId())
                .orElseThrow(() -> new EntityNotFoundException("Paciente não encontrado."));

        Psychologist psychologist = psychologistRepository.findById(dto.psychologistId())
                .orElseThrow(() -> new EntityNotFoundException("Psicólogo não encontrado"));

        Appointment appointment = new Appointment(
                dto.dateTime(),
                AppointmentStatus.SCHEDULED,
                patient,
                psychologist);

        return appointmentRepository.save(appointment);
    }


    public void deleteAppointment(UUID id, User loggedUser) {
        if(loggedUser == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário não autenticado!");
        }
        findAppointmentById(id);
        appointmentRepository.deleteById(id);

    }
}