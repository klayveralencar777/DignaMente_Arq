package com.dignamente.br.api.service;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.dignamente.br.api.dto.MedicalRecord.MedicalRecordRequestDTO;
import com.dignamente.br.api.dto.MedicalRecord.MedicalRecordResponseDTO;
import com.dignamente.br.api.entities.Appointment;
import com.dignamente.br.api.entities.MedicalRecord;
import com.dignamente.br.api.entities.User;
import com.dignamente.br.api.enums.TypeUser;
import com.dignamente.br.api.exceptions.EntityNotFoundException;
import com.dignamente.br.api.repository.AppointmentRepository;
import com.dignamente.br.api.repository.MedicalRecordRepository;

@Service
public class MedicalRecordService {

    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    public MedicalRecordResponseDTO createMedicalRecord(MedicalRecordRequestDTO dto, User loggedUser) {
        checkUser(loggedUser);

        if (loggedUser.getTypeUser() != TypeUser.PSYCHOLOGIST) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Somente psicólogos podem criar prontuários.");
        }

        if (dto.appointmentId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O ID da consulta é obrigatório.");
        }

        Appointment appointment = appointmentRepository.findById(dto.appointmentId())
                .orElseThrow(() -> new EntityNotFoundException("Consulta não encontrada."));

        if (!appointment.getPsychologist().getId().equals(loggedUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Você só pode criar prontuário das suas próprias consultas.");
        }

        if (medicalRecordRepository.existsByAppointmentId(dto.appointmentId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Essa consulta já possui prontuário.");
        }

        MedicalRecord medicalRecord = new MedicalRecord();
        medicalRecord.setAppointment(appointment);
        medicalRecord.setPatient(appointment.getPatient());
        medicalRecord.setPsychologist(appointment.getPsychologist());
        medicalRecord.setNotes(dto.notes());
        medicalRecord.setDiagnosis(dto.diagnosis());
        medicalRecord.setPrescription(dto.prescription());

        MedicalRecord saved = medicalRecordRepository.save(medicalRecord);

        return toDto(saved);
    }

    public MedicalRecordResponseDTO findMedicalRecordById(UUID id, User loggedUser) {
        checkUser(loggedUser);

        MedicalRecord medicalRecord = medicalRecordRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Prontuário não encontrado."));

        checkAccess(medicalRecord, loggedUser);

        return toDto(medicalRecord);
    }

    public List<MedicalRecordResponseDTO> myMedicalRecords(User loggedUser) {
        checkUser(loggedUser);

        if (loggedUser.getTypeUser() == TypeUser.PATIENT) {
            return medicalRecordRepository.findByPatientId(loggedUser.getId())
                    .stream()
                    .map(this::toDto)
                    .toList();
        }

        if (loggedUser.getTypeUser() == TypeUser.PSYCHOLOGIST) {
            return medicalRecordRepository.findByPsychologistId(loggedUser.getId())
                    .stream()
                    .map(this::toDto)
                    .toList();
        }

        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Tipo de usuário inválido.");
    }

    public MedicalRecordResponseDTO updateMedicalRecord(UUID id, MedicalRecordRequestDTO dto, User loggedUser) {
        checkUser(loggedUser);

        if (loggedUser.getTypeUser() != TypeUser.PSYCHOLOGIST) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Somente psicólogos podem editar prontuários.");
        }

        MedicalRecord medicalRecord = medicalRecordRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Prontuário não encontrado."));

        if (!medicalRecord.getPsychologist().getId().equals(loggedUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Você só pode editar seus próprios prontuários.");
        }

        medicalRecord.setNotes(dto.notes());
        medicalRecord.setDiagnosis(dto.diagnosis());
        medicalRecord.setPrescription(dto.prescription());

        MedicalRecord updated = medicalRecordRepository.save(medicalRecord);

        return toDto(updated);
    }

    public void deleteMedicalRecord(UUID id, User loggedUser) {
        checkUser(loggedUser);

        if (loggedUser.getTypeUser() != TypeUser.PSYCHOLOGIST) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Somente psicólogos podem excluir prontuários.");
        }

        MedicalRecord medicalRecord = medicalRecordRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Prontuário não encontrado."));

        if (!medicalRecord.getPsychologist().getId().equals(loggedUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Você só pode excluir seus próprios prontuários.");
        }

        medicalRecordRepository.deleteById(id);
    }

    private void checkUser(User user) {
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário não autenticado!");
        }
    }

    private void checkAccess(MedicalRecord medicalRecord, User loggedUser) {
        boolean isPatientOwner = loggedUser.getTypeUser() == TypeUser.PATIENT
                && medicalRecord.getPatient().getId().equals(loggedUser.getId());

        boolean isPsychologistOwner = loggedUser.getTypeUser() == TypeUser.PSYCHOLOGIST
                && medicalRecord.getPsychologist().getId().equals(loggedUser.getId());

        if (!isPatientOwner && !isPsychologistOwner) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Você não tem acesso a este prontuário.");
        }
    }

    private MedicalRecordResponseDTO toDto(MedicalRecord medicalRecord) {
        return new MedicalRecordResponseDTO(
                medicalRecord.getId(),
                medicalRecord.getAppointment().getId(),
                medicalRecord.getPatient().getId(),
                medicalRecord.getPatient().getName(),
                medicalRecord.getPsychologist().getId(),
                medicalRecord.getPsychologist().getName(),
                medicalRecord.getNotes(),
                medicalRecord.getDiagnosis(),
                medicalRecord.getPrescription(),
                medicalRecord.getCreatedAt(),
                medicalRecord.getUpdatedAt());
    }
}