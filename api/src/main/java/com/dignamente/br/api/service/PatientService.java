package com.dignamente.br.api.service;


import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.dignamente.br.api.dto.Patient.PatientRequestDTO;
import com.dignamente.br.api.dto.Patient.PatientResponseDTO;
import com.dignamente.br.api.entities.Patient;
import com.dignamente.br.api.exceptions.EmailAlreadyExistsException;
import com.dignamente.br.api.exceptions.EntityNotFoundException;
import com.dignamente.br.api.mapper.PatientMapper;
import com.dignamente.br.api.repository.PatientRepository;

@Service
public class PatientService {



    @Autowired
    private  PatientRepository patientRepository;

    @Autowired
    private PatientMapper patientMapper;
    
    @Autowired
    private PasswordEncoder passwordEncoder;



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

    public void createPatient(PatientRequestDTO dto) {
        if(patientRepository.existsByEmail(dto.email())) {
            throw new EmailAlreadyExistsException("Paciente já cadastrado com o email " + dto.email());
        }

        Patient patient = patientMapper.toEntity(dto);
        String hashPassword = passwordEncoder.encode(dto.password());
        patient.setPassword(hashPassword);

        patientRepository.save(patient);
        

    }

    public Patient updatePatient(UUID id, Patient patient) {
        Patient updatePatient = findPatientById(id);

        if(patientRepository.existsByEmail(patient.getEmail()) && !patient.getEmail().equals(updatePatient.getEmail())) {
            throw new EmailAlreadyExistsException("Já existe um paciente com o email " + patient.getEmail());
        }

        updatePatient.setName(patient.getName());
        updatePatient.setEmail(patient.getEmail());
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
