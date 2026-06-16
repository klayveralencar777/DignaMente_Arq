package com.dignamente.br.api.config.controller;

import com.dignamente.br.api.dto.MedicalRecord.MedicalRecordRequestDTO;
import com.dignamente.br.api.dto.MedicalRecord.MedicalRecordResponseDTO;
import com.dignamente.br.api.entities.User;
import com.dignamente.br.api.service.MedicalRecordService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/medical-records")
public class MedicalRecordController {

    @Autowired
    private MedicalRecordService medicalRecordService;

    @PostMapping
    public ResponseEntity<MedicalRecordResponseDTO> createMedicalRecord(
            @RequestBody @Valid MedicalRecordRequestDTO dto,
            @AuthenticationPrincipal User loggedUser) {
        MedicalRecordResponseDTO medicalRecord = medicalRecordService.createMedicalRecord(dto, loggedUser);
        return ResponseEntity.status(201).body(medicalRecord);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicalRecordResponseDTO> findMedicalRecordById(
            @PathVariable UUID id,
            @AuthenticationPrincipal User loggedUser) {
        MedicalRecordResponseDTO medicalRecord = medicalRecordService.findMedicalRecordById(id, loggedUser);
        return ResponseEntity.ok(medicalRecord);
    }

    @GetMapping("/me")
    public ResponseEntity<List<MedicalRecordResponseDTO>> myMedicalRecords(
            @AuthenticationPrincipal User loggedUser) {
        return ResponseEntity.ok(medicalRecordService.myMedicalRecords(loggedUser));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MedicalRecordResponseDTO> updateMedicalRecord(
            @PathVariable UUID id,
            @RequestBody @Valid MedicalRecordRequestDTO dto,
            @AuthenticationPrincipal User loggedUser) {
        MedicalRecordResponseDTO medicalRecord = medicalRecordService.updateMedicalRecord(id, dto, loggedUser);
        return ResponseEntity.ok(medicalRecord);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedicalRecord(
            @PathVariable UUID id,
            @AuthenticationPrincipal User loggedUser) {
        medicalRecordService.deleteMedicalRecord(id, loggedUser);
        return ResponseEntity.noContent().build();
    }
}
