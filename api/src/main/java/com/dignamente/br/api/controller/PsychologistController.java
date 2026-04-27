package com.dignamente.br.api.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType; // <-- NOVO IMPORT
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute; // <-- NOVO IMPORT
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam; // <-- NOVO IMPORT
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile; // <-- NOVO IMPORT

import com.dignamente.br.api.dto.Psychologist.PsychologistResponseDTO;
import com.dignamente.br.api.entities.Psychologist;
import com.dignamente.br.api.service.PsychologistService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/psychologists")
public class PsychologistController {

    @Autowired
    private PsychologistService psychologistService;

    @GetMapping("")
    public ResponseEntity<List<PsychologistResponseDTO>> findPsychologists(){
        return ResponseEntity.ok(psychologistService.findPsychologists());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Psychologist> findPsychologistById(@PathVariable UUID id) {
        Psychologist psychologist = psychologistService.findPsychologistById(id);
        return ResponseEntity.ok(psychologist);
    }

    // ========================================================================
    // MUDANÇA PRINCIPAL AQUI:
    // Aceita MULTIPART_FORM_DATA e usa @ModelAttribute em vez de @RequestBody
    // ========================================================================
    @PostMapping(value = "", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> createPsychologist(
            @Valid @ModelAttribute Psychologist psychologist,
            @RequestParam("selfieFile") MultipartFile selfieFile,
            @RequestParam("idFile") MultipartFile idFile,
            @RequestParam("crpFile") MultipartFile crpFile) {

        // Dica para o Backend:
        // Aqui os arquivos (selfieFile, idFile, crpFile) já chegaram com sucesso!
        // Mais pra frente, você precisará criar a lógica no PsychologistService
        // para salvar esses arquivos no servidor, banco de dados ou AWS S3.

        psychologistService.createPsychologist(psychologist);
        return ResponseEntity.status(201).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Psychologist> updatePsychologist(@PathVariable UUID id, @Valid @RequestBody Psychologist psychologist) {
        Psychologist updatePsychologist = psychologistService.updatePsychologist(id, psychologist);
        return ResponseEntity.ok(updatePsychologist);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePsychologist(@PathVariable UUID id) {
        psychologistService.deletePsychologist(id);
        return ResponseEntity.noContent().build();
    }

}