package com.dignamente.br.api.service;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.dignamente.br.api.dto.Patient.PatientResponseDTO;
import com.dignamente.br.api.entities.Patient;
import com.dignamente.br.api.exceptions.EmailAlreadyExistsException;
import com.dignamente.br.api.exceptions.EntityNotFoundException;
import com.dignamente.br.api.repository.PatientRepository;

@Service
public class PatientService {

    @Autowired
    private  PatientRepository patientRepository;
    
    private final PasswordEncoder passwordEncoder;


    public PatientService(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    public List<PatientResponseDTO> findPatients() {
        return patientRepository.findAll()
        .stream()
        .map(patient -> new PatientResponseDTO(
            patient.getId(),
            patient.getName(),
            patient.getEmail(),
            patient.getCpf(),
            patient.getTypeUser(),
            patient.getCardSus(),
            patient.getBirthDate(),
            patient.getCreatedAt(),
            patient.getUpdatedAt()
        )).toList();

    }

    public Patient findPatientById(UUID id) {
        return patientRepository.findById(id).
        orElseThrow(() -> new EntityNotFoundException("Paciente não encontrado com o ID: " + id));

    }

    public void createPatient(Patient patient) {
        if(patientRepository.existsByEmail(patient.getEmail())) {
            throw new EmailAlreadyExistsException("Paciente já cadastrado com o email " + patient.getEmail());
        }

        Patient patientEncrypt = new Patient();
        patientEncrypt.setName(patient.getName());
        patientEncrypt.setEmail(patient.getEmail());
        patientEncrypt.setCpf(patient.getCpf());
        patientEncrypt.setCardSus(patient.getCardSus());
        patientEncrypt.setTypeUser(patient.getTypeUser());
        patientEncrypt.setBirthDate(patient.getBirthDate());
        String passwordEncrypt = passwordEncoder.encode(patient.getPassword());
        patientEncrypt.setPassword(passwordEncrypt);
          
        patientRepository.save(patientEncrypt);

    }

    public Patient updatePatient(UUID id, Patient patient) {
        Patient updatePatient = findPatientById(id);
        updatePatient.setName(patient.getName());
        updatePatient.setEmail(patient.getEmail());
        updatePatient.setPassword(patient.getPassword());
        updatePatient.setCpf(patient.getCpf());
        updatePatient.setCardSus(patient.getCardSus());
        updatePatient.setBirthDate(patient.getBirthDate());
        return patientRepository.save(updatePatient);
    }

    public void deletePatient(UUID id) {
        findPatientById(id);
        patientRepository.deleteById(id);
    }
    
}
