package com.dignamente.br.api.service;

import com.dignamente.br.api.dto.Appointment.AppointmentRequestDTO;
import com.dignamente.br.api.dto.Appointment.AppointmentResponseDTO;
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

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
public class AppointmentService {

    
    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private  PatientRepository patientRepository;

    @Autowired
    private  PsychologistRepository psychologistRepository;

   
      public List<Appointment> findAll(User loggedUser) {
        checkUser(loggedUser);
        
        if(loggedUser.getTypeUser() != TypeUser.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Somente admins podem visualizar todas as consultas");

        }
        return appointmentRepository.findAll();
    }

    public List<Appointment> myAppointments(User loggedUser) {
        checkUser(loggedUser);
        if(loggedUser.getTypeUser()  == TypeUser.PATIENT ) {
            return appointmentRepository.findAppointmentsByPatientId(loggedUser.getId());
        }
        else if(loggedUser.getTypeUser() == TypeUser.PSYCHOLOGIST) {
            return appointmentRepository.findAppointmentsByPsychologistId(loggedUser.getId());
        }
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Tipo de usuário inválido.");

    }

    public AppointmentResponseDTO findAppointmentById(UUID id) {

        Appointment appointment = appointmentRepository.findById(id).orElseThrow(
            () -> new EntityNotFoundException("Consulta não encontrada com esse ID"));
        
          return responseDTO(appointment);
    }

    public AppointmentResponseDTO createAppointment(AppointmentRequestDTO dto, User loggedUser) {
        checkUser(loggedUser);
        checkTypeUser(loggedUser);

        Patient patient = patientRepository.findById(loggedUser.getId())
                .orElseThrow(() -> new EntityNotFoundException("Paciente não encontrado."));

        Psychologist psychologist = psychologistRepository.findById(dto.psychologistId())
                .orElseThrow(() -> new EntityNotFoundException("Psicólogo não encontrado"));

        Appointment appointment = new Appointment(
                dto.dateTime(),
                AppointmentStatus.SCHEDULED,
                patient,
                psychologist);


        Appointment appointmentSaved = appointmentRepository.save(appointment);
        return responseDTO(appointmentSaved);
    }


    public void deleteAppointment(UUID id, User loggedUser) {
        checkUser(loggedUser);
        findAppointmentById(id);
        appointmentRepository.deleteById(id);

    }

    public void checkUser(User user) {
        if(user == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário não autenticado!");
        }

    }

    public void checkTypeUser(User user) {
         if(user.getTypeUser() != TypeUser.PATIENT) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Somente pacientes agendam consultas..");
        }


    }

    public AppointmentResponseDTO responseDTO(Appointment appointment) {
        return new AppointmentResponseDTO(
            appointment.getId(),
            appointment.getPatient().getId(),
            appointment.getPsychologist().getId(),
            appointment.getDateTime(),
            appointment.getStatus(),
            appointment.getPatient().getName(),
            appointment.getPsychologist().getName()

        );

    }

}