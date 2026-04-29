package com.dignamente.br.api.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.dignamente.br.api.dto.Patient.PatientResponseDTO;
import com.dignamente.br.api.entities.Patient;
import com.dignamente.br.api.service.PatientService;

import jakarta.validation.Valid;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/patients")
public class PatientController {

    @Autowired
    private PatientService patientService;

    @GetMapping("")
    public ResponseEntity<List<PatientResponseDTO>> findPatients() {
        return ResponseEntity.ok(patientService.findPatients());

    }

    @GetMapping("/{id}")
    public ResponseEntity<Patient> findPatientById(@PathVariable UUID id) {
        Patient patient = patientService.findPatientById(id);
        return ResponseEntity.ok(patient);
    }

    @PostMapping("")
    public ResponseEntity<Void> createPatient(@Valid @RequestBody Patient patient) {
        patientService.createPatient(patient);
        return ResponseEntity.status(201).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Patient> updatePatient(@PathVariable UUID id, @Valid @RequestBody Patient patient) {
        Patient updatePatient = patientService.updatePatient(id, patient);
        return ResponseEntity.ok(updatePatient);

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePatient(@PathVariable UUID id) {
        patientService.deletePatient(id);
        return ResponseEntity.noContent().build();
    }

}
