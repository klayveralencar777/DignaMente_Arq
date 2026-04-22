package com.dignamente.br.api.service;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.dignamente.br.api.dto.Psychologist.PsychologistResponseDTO;
import com.dignamente.br.api.entities.Psychologist;
import com.dignamente.br.api.exceptions.EmailAlreadyExistsException;
import com.dignamente.br.api.exceptions.EntityNotFoundException;
import com.dignamente.br.api.repository.PsychologistRepository;

@Service
public class PsychologistService {

    @Autowired
    private PsychologistRepository psychologistRepository;

    private final PasswordEncoder passwordEncoder;

    public PsychologistService(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    public List<PsychologistResponseDTO> findPsychologists() {
        return psychologistRepository.findAll()
            .stream()
            .map(psychologist -> new PsychologistResponseDTO(
                psychologist.getId(),
                psychologist.getName(),
                psychologist.getEmail(),
                psychologist.getCpf(),
                psychologist.getTypeUser().name(),
                psychologist.getCrp(),
                psychologist.getBirthDate(),
                psychologist.getCreatedAt(),
                psychologist.getUpdatedAt()
            ))
            .toList();
    }

    public Psychologist findPsychologistById(UUID id) {
        return psychologistRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Psicólogo não encontrado com o ID: " + id));
    }

    public void createPsychologist(Psychologist psychologist) {
        if(psychologistRepository.existsByEmail(psychologist.getEmail())) {
            throw new EmailAlreadyExistsException("Psicólogo já cadastrado com o email " + psychologist.getEmail());
        }

        Psychologist psychologistEncrypt = new Psychologist();
        psychologistEncrypt.setName(psychologist.getName());
        psychologistEncrypt.setEmail(psychologist.getEmail());
        psychologistEncrypt.setCpf(psychologist.getCpf());
        psychologistEncrypt.setCrp(psychologist.getCrp());
        psychologistEncrypt.setTypeUser(psychologist.getTypeUser());
        psychologistEncrypt.setBirthDate(psychologist.getBirthDate());
        String passwordEncrypt = passwordEncoder.encode(psychologist.getPassword());
        psychologistEncrypt.setPassword(passwordEncrypt);
        
        psychologistRepository.save(psychologistEncrypt);
    }

    public Psychologist updatePsychologist(UUID id, Psychologist psychologist) {
        Psychologist updatePsychologist = findPsychologistById(id);
        updatePsychologist.setName(psychologist.getName());
        updatePsychologist.setEmail(psychologist.getEmail());
        updatePsychologist.setPassword(psychologist.getPassword());
        updatePsychologist.setCpf(psychologist.getCpf());
        updatePsychologist.setCrp(psychologist.getCrp());
        updatePsychologist.setBirthDate(psychologist.getBirthDate());
        return psychologistRepository.save(updatePsychologist);
    }

    public void deletePsychologist(UUID id) {
        findPsychologistById(id);
        psychologistRepository.deleteById(id);
    }
    
}
