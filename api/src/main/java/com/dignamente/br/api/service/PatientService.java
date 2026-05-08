package com.dignamente.br.api.service;


import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.dignamente.br.api.dto.Patient.PatientRequestDTO;
import com.dignamente.br.api.dto.Patient.PatientResponseDTO;
import com.dignamente.br.api.entities.Patient;
import com.dignamente.br.api.enums.TypeUser;
import com.dignamente.br.api.exceptions.CPFAlreadyExistsException;
import com.dignamente.br.api.exceptions.EmailAlreadyExistsException;
import com.dignamente.br.api.exceptions.EntityNotFoundException;
import com.dignamente.br.api.mapper.PatientMapper;
import com.dignamente.br.api.repository.PatientRepository;
import com.dignamente.br.api.repository.UserRepository;

@Service
public class PatientService {



    private final UserRepository userRepository;

    @Autowired
    private  PatientRepository patientRepository;

    @Autowired
    private PatientMapper patientMapper;
    
    @Autowired
    private PasswordEncoder passwordEncoder;


    @Autowired
    private UserValidationService userValidationService;


    PatientService(UserRepository userRepository) {
        this.userRepository = userRepository;
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

   

    public void createPatient(PatientRequestDTO dto) {
        
        userValidationService.validateCpf(dto.cpf());
        userValidationService.validateEmail(dto.email());
        
        if(dto.password() == null || dto.password().isBlank()) {
            throw new IllegalArgumentException("Senha é obrigatória");
        }

        Patient patient = patientMapper.toEntity(dto);
        String hashPassword = passwordEncoder.encode(dto.password());
        patient.setPassword(hashPassword);
        patient.setTypeUser(TypeUser.PATIENT);

        patientRepository.save(patient);
        

    }

    public Patient updatePatient(UUID id, PatientRequestDTO dto) {
        Patient patient = findPatientById(id);
        
        
        if (dto.email() != null && !dto.email().equals(patient.getEmail())) {
        if (userRepository.existsByEmailAndIdNot(dto.email(), id)) {
            throw new EmailAlreadyExistsException(
                "Já existe um paciente com o email " + dto.email()
            );
        }
        patient.setEmail(dto.email());
    }

        if(dto.cpf() != null && !dto.cpf().equals(patient.getCpf())) {
            if(userRepository.existsByCpfAndIdNot(dto.cpf(), id)) {
                throw new CPFAlreadyExistsException("Cpf já cadastrado!");
            }
            patient.setCpf(dto.cpf());
        }

        if (dto.password() != null && !dto.password().isBlank()) {
                String hashPassword = passwordEncoder.encode(dto.password());
                patient.setPassword(hashPassword);
        }


        patientMapper.updatePatient(dto, patient);
        return patientRepository.save(patient);
    }

    public void deletePatient(UUID id) {
        findPatientById(id);
        patientRepository.deleteById(id);
    }


}
