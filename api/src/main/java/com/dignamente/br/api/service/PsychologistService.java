package com.dignamente.br.api.service;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.dignamente.br.api.dto.Psychologist.PsychologistRequestDTO;
import com.dignamente.br.api.dto.Psychologist.PsychologistResponseDTO;
import com.dignamente.br.api.entities.Psychologist;
import com.dignamente.br.api.exceptions.CPFAlreadyExistsException;
import com.dignamente.br.api.exceptions.EmailAlreadyExistsException;
import com.dignamente.br.api.exceptions.EntityNotFoundException;
import com.dignamente.br.api.mapper.PsychologistMapper;
import com.dignamente.br.api.repository.PsychologistRepository;

@Service
public class PsychologistService {

    @Autowired
    private PsychologistRepository psychologistRepository;


    @Autowired
    private  PasswordEncoder passwordEncoder;


    @Autowired
    private PsychologistMapper psychologistMapper;

   

    public List<PsychologistResponseDTO> findPsychologists() {
        return psychologistRepository.findAll()
            .stream()
            .map(psychologist -> new PsychologistResponseDTO(
                psychologist.getId(),
                psychologist.getName(),
                psychologist.getEmail(),
                psychologist.getCpf(),
                psychologist.getTypeUser(),
                psychologist.getCrp(),
                psychologist.getSpecialty(),
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

    public void createPsychologist(PsychologistRequestDTO dto) {
        if(psychologistRepository.existsByEmail(dto.email())) {
            throw new EmailAlreadyExistsException("Psicólogo já cadastrado com o email " + dto.email());
        }
        
        if(psychologistRepository.existsByCpf(dto.cpf())) {
            throw new CPFAlreadyExistsException("CPF já cadastrado, tente outro");
        }

        Psychologist psychologist = psychologistMapper.toEntity(dto);

        String hashPassword = passwordEncoder.encode(dto.password());

        psychologist.setPassword(hashPassword);

        psychologistRepository.save(psychologist);
        
    }

    public Psychologist updatePsychologist(UUID id, PsychologistRequestDTO dto) {
        Psychologist updatedPsychologist = findPsychologistById(id);

        if(psychologistRepository.existsByEmail(dto.email()) && !updatedPsychologist.getEmail().equals(dto.email())) {
            throw new EmailAlreadyExistsException("Já existe um psicólogo com o email" + dto.email());
        }

        if(dto.password() != null && dto.password() != updatedPsychologist.getPassword()) {
            String hashPassword = passwordEncoder.encode(dto.password());
            psychologistMapper.updatePsychologist(dto, updatedPsychologist);
            updatedPsychologist.setPassword(hashPassword);
            return psychologistRepository.save(updatedPsychologist);
        

        }

         psychologistMapper.updatePsychologist(dto, updatedPsychologist);
         return psychologistRepository.save(updatedPsychologist);
  
    }

    public void deletePsychologist(UUID id) {
        findPsychologistById(id);
        psychologistRepository.deleteById(id);
    }
    
}
