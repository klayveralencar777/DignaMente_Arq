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
import com.dignamente.br.api.mapper.AppointmentMapper;
import com.dignamente.br.api.repository.AppointmentRepository;
import com.dignamente.br.api.repository.PatientRepository;
import com.dignamente.br.api.repository.PsychologistRepository;
import com.dignamente.br.api.service.strategy.PatientAppointmentFinderStrategy;
import com.dignamente.br.api.service.strategy.PsychologistAppointmentFinderStrategy;

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
    private PatientRepository patientRepository;

    @Autowired
    private PsychologistRepository psychologistRepository;

    @Autowired
    private AppointmentMapper appointmentMapper;

    @Autowired
    private PatientAppointmentFinderStrategy patientStrategy;

    @Autowired
    private PsychologistAppointmentFinderStrategy psychologistStrategy;

    @Autowired
    private GoogleMeetService googleMeetService;

    public List<AppointmentResponseDTO> myAppointments(User loggedUser) {
        checkUser(loggedUser);
        List<Appointment> appointments;

        if (loggedUser.getTypeUser() == TypeUser.PATIENT) {
            appointments = patientStrategy.find(loggedUser);

        } 
        
        else if (loggedUser.getTypeUser() == TypeUser.PSYCHOLOGIST) {

            appointments = psychologistStrategy.find(loggedUser);
        } 

        else {

            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Tipo de usuário inválido.");
        }

        return appointmentMapper.toListDto(appointments);
    }

    public AppointmentResponseDTO findAppointmentById(UUID id) {

        Appointment appointment = appointmentRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("Consulta não encontrada com esse ID"));

        return appointmentMapper.toDto(appointment);
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
        return appointmentMapper.toDto(appointmentSaved);
    }

    public AppointmentResponseDTO createMeetLink(UUID id, User loggedUser) {
        checkUser(loggedUser);

        Appointment appointment = appointmentRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("Consulta não encontrada com esse ID"));

        boolean isPatientOwner = appointment.getPatient().getId().equals(loggedUser.getId());
        boolean isPsychologistOwner = appointment.getPsychologist().getId().equals(loggedUser.getId());

        if (!isPatientOwner && !isPsychologistOwner) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Você só pode gerar Meet para suas consultas.");
        }

        if (appointment.getMeetingLink() != null && !appointment.getMeetingLink().isBlank()) {
            return appointmentMapper.toDto(appointment);
        }

        GoogleMeetService.GoogleMeetEvent meetEvent = googleMeetService.createMeet(appointment);
        appointment.setGoogleCalendarEventId(meetEvent.eventId());
        appointment.setMeetingLink(meetEvent.meetingLink());

        Appointment appointmentSaved = appointmentRepository.save(appointment);
        return appointmentMapper.toDto(appointmentSaved);
    }

    public void deleteAppointment(UUID id, User loggedUser) {
        checkUser(loggedUser);
        AppointmentResponseDTO appointment = findAppointmentById(id);
        if (!appointment.patientId().equals(loggedUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Você só pode cancelar suas próprias consultas.");
        }
        appointmentRepository.deleteById(id);

    }

    public void checkUser(User user) {
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário não autenticado!");
        }

    }

    public void checkTypeUser(User user) {
        if (user.getTypeUser() != TypeUser.PATIENT) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Somente pacientes agendam consultas..");
        }

    }

}
