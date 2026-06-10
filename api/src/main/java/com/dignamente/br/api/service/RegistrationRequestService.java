package com.dignamente.br.api.service;


import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.dignamente.br.api.dto.PsychologistRequestRegistration.RegistrationRequestDTO;
import com.dignamente.br.api.entities.PsychologistRegistrationRequest;
import com.dignamente.br.api.enums.RegistrationStatus;
import com.dignamente.br.api.repository.PsychologistRegistrationRepository;

@Service
public class RegistrationRequestService {

    private final FileStorageService fileStorageService;
    private final PsychologistRegistrationRepository repository;
    private final PasswordEncoder passwordEncoder;

    public RegistrationRequestService(
            FileStorageService fileStorageService,
            PsychologistRegistrationRepository repository,
            PasswordEncoder passwordEncoder
    ) {
        this.fileStorageService = fileStorageService;
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

     public PsychologistRegistrationRequest create(RegistrationRequestDTO dto) {

        
        String diplomaPath = fileStorageService.storeFile(dto.diploma());
        String crpDocumentPath = fileStorageService.storeFile(dto.crpDocument());

        
        PsychologistRegistrationRequest request = new PsychologistRegistrationRequest();

        request.setName(dto.name());
        request.setEmail(dto.email());

        
        request.setPassword(passwordEncoder.encode(dto.password()));

        request.setCpf(dto.cpf());

        
        request.setDiplomaPath(diplomaPath);
        request.setCrpDocumentPath(crpDocumentPath);

        
        request.setStatus(RegistrationStatus.PENDING);

        
        return repository.save(request);
    }

      

    
}
