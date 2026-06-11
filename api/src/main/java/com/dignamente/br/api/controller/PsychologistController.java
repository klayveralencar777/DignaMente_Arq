package com.dignamente.br.api.controller;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dignamente.br.api.dto.Psychologist.PsychologistRequestDTO;
import com.dignamente.br.api.dto.Psychologist.PsychologistResponseDTO;
import com.dignamente.br.api.entities.Psychologist;
import com.dignamente.br.api.entities.User;
import com.dignamente.br.api.service.PsychologistService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/psychologists")
public class PsychologistController {

    @Autowired
    private PsychologistService psychologistService;

    @GetMapping("")
    public ResponseEntity<List<PsychologistResponseDTO>> findPsychologists() {
        return ResponseEntity.ok(psychologistService.findPsychologists());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Psychologist> findPsychologistById(@PathVariable UUID id) {
        Psychologist psychologist = psychologistService.findPsychologistById(id);
        return ResponseEntity.ok(psychologist);
    }

    @PostMapping("")
    public ResponseEntity<Void> createPsychologist(@RequestBody @Valid PsychologistRequestDTO dto) {
        psychologistService.createPsychologist(dto);
        return ResponseEntity.status(201).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Psychologist> updatePsychologist(@PathVariable UUID id,
            @Valid @RequestBody PsychologistRequestDTO dto) {
        Psychologist updatePsychologist = psychologistService.updatePsychologist(id, dto);
        return ResponseEntity.ok(updatePsychologist);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePsychologist(@PathVariable UUID id) {
        psychologistService.deletePsychologist(id);
        return ResponseEntity.noContent().build();
    }

    // BUSCAR HORÁRIOS SALVOS DO PSICÓLOGO LOGADO
    @GetMapping("/me/availability")
    public ResponseEntity<Map<String, Object>> getMyAvailability(@AuthenticationPrincipal User loggedUser) {
        Map<String, Object> availability = psychologistService.getAvailability(loggedUser);
        return ResponseEntity.ok(availability);
    }

    // ATUALIZAR/SALVAR HORÁRIOS DO PSICÓLOGO LOGADO
    @PutMapping("/me/availability")
    public ResponseEntity<Void> updateAvailability(
            @RequestBody Map<String, Object> availabilityDto,
            @AuthenticationPrincipal User loggedUser) {
        
        psychologistService.updateAvailability(availabilityDto, loggedUser);
        return ResponseEntity.noContent().build();
    }
}