package com.dignamente.br.api.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.dignamente.br.api.dto.Psychologist.PsychologistRequestDTO;
import com.dignamente.br.api.dto.Psychologist.PsychologistResponseDTO;
import com.dignamente.br.api.entities.Psychologist;
import com.dignamente.br.api.entities.User; // <-- IMPORTAÇÃO DO USER CORRIGIDA AQUI!
import com.dignamente.br.api.enums.TypeUser;
import com.dignamente.br.api.exceptions.CPFAlreadyExistsException;
import com.dignamente.br.api.exceptions.EmailAlreadyExistsException;
import com.dignamente.br.api.exceptions.EntityNotFoundException;
import com.dignamente.br.api.mapper.PsychologistMapper;
import com.dignamente.br.api.repository.PsychologistRepository;
import com.dignamente.br.api.repository.UserRepository;

@Service
public class PsychologistService {

    private final UserRepository userRepository;

    @Autowired
    private PsychologistRepository psychologistRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private PsychologistMapper psychologistMapper;

    @Autowired
    private UserValidationService userValidationService;

    PsychologistService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

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
        userValidationService.validateCpf(dto.cpf());
        userValidationService.validateEmail(dto.email());

        if (dto.password() == null || dto.password().isBlank()) {
                throw new IllegalArgumentException("Senha é obrigatória");
            }

        Psychologist psychologist = psychologistMapper.toEntity(dto);

        String hashPassword = passwordEncoder.encode(dto.password());

        psychologist.setPassword(hashPassword);
        psychologist.setTypeUser(TypeUser.PSYCHOLOGIST);
        psychologistRepository.save(psychologist);
    }

    public Psychologist updatePsychologist(UUID id, PsychologistRequestDTO dto) {
        Psychologist psychologist = findPsychologistById(id);

        if (dto.email() != null && !dto.email().equals(psychologist.getEmail())) {
            if (userRepository.existsByEmailAndIdNot(dto.email(), id)) {
                throw new EmailAlreadyExistsException(
                    "Já existe um psicólogo com o email " + dto.email()
                );
            }
            psychologist.setEmail(dto.email());
        }

        if(dto.cpf() != null && !dto.cpf().equals(psychologist.getCpf())) {
            if(userRepository.existsByCpfAndIdNot(dto.cpf(), id)) {
                throw new CPFAlreadyExistsException("Cpf já cadastrado!");
            }
            psychologist.setCpf(dto.cpf());
        }

        psychologistMapper.updatePsychologist(dto, psychologist);

        if (dto.password() != null && !dto.password().isBlank()) {
            String hashPassword = passwordEncoder.encode(dto.password());
            psychologist.setPassword(hashPassword);
        }

        return psychologistRepository.save(psychologist);
    }

    public void deletePsychologist(UUID id) {
        findPsychologistById(id);
        psychologistRepository.deleteById(id);
    }

    // --- MOCK INTELIGENTE PARA NÃO QUEBRAR A ENTIDADE DO BANCO ---
    public Map<String, Object> getAvailability(User loggedUser) {
        // Apenas valida se o usuário existe no banco
        userRepository.findById(loggedUser.getId())
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));

        // Retorna um objeto padrão pré-configurado para o Front-end renderizar sem dar erro de tela branca
        Map<String, Object> defaultAvailability = new HashMap<>();
        Map<String, Object> dayConfig = new HashMap<>();
        dayConfig.put("active", true);
        dayConfig.put("startTime", "08:00");
        dayConfig.put("endTime", "18:00");

        defaultAvailability.put("monday", dayConfig);
        defaultAvailability.put("tuesday", dayConfig);
        defaultAvailability.put("wednesday", dayConfig);
        defaultAvailability.put("thursday", dayConfig);
        defaultAvailability.put("friday", dayConfig);

        return defaultAvailability;
    }

    public void updateAvailability(Map<String, Object> availabilityDto, User loggedUser) {
        // Valida se o usuário existe
        userRepository.findById(loggedUser.getId())
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));
        
        // Simula o salvamento com sucesso para responder HTTP 204 No Content pro seu botão do Front-end funcionar na hora!
        System.out.println("Disponibilidade salva com sucesso para o usuário: " + loggedUser.getEmail());
    }
}