package com.dignamente.br.api.service;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dignamente.br.api.entities.Patient;
import com.dignamente.br.api.repository.PatientRepository;

@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;

    public List<Patient> findPatients() {
        return patientRepository.findAll();

    }

    public Patient findPatientById(UUID id) {
        return patientRepository.findById(id).
        orElseThrow(() -> new RuntimeException("Paciente não encontrado com o ID: " + id));

    }

    public void createPatient(Patient patient) {
        patientRepository.save(patient);
    
        
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
