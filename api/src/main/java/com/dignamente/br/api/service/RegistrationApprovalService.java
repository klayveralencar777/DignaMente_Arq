package com.dignamente.br.api.service;

import java.util.UUID;

import com.dignamente.br.api.entities.Psychologist;
import com.dignamente.br.api.entities.PsychologistRegistrationRequest;
import com.dignamente.br.api.entities.User;
import com.dignamente.br.api.enums.RegistrationStatus;
import com.dignamente.br.api.enums.TypeUser;
import com.dignamente.br.api.repository.PsychologistRegistrationRepository;
import com.dignamente.br.api.repository.PsychologistRepository;

public class RegistrationApprovalService {

    private final PsychologistRegistrationRepository requestRepository;
    private final PsychologistRepository psychologistRepository;

    public RegistrationApprovalService(
            PsychologistRegistrationRepository requestRepository,
            PsychologistRepository psychologistRepository
    ) {
        this.requestRepository = requestRepository;
        this.psychologistRepository = psychologistRepository;
    }

    public void approve(UUID requestId, User loggedUser) {

       
        if (loggedUser.getTypeUser() != TypeUser.ADMIN) {
            throw new RuntimeException("Acesso negado: apenas ADMIN pode aprovar");
        }

        
        PsychologistRegistrationRequest request =
                requestRepository.findById(requestId)
                        .orElseThrow(() -> new RuntimeException("Request não encontrada"));

        if (request.getStatus() != RegistrationStatus.PENDING) {
            throw new RuntimeException("Request já foi processada");
        }

        
        Psychologist psychologist = new Psychologist();

        psychologist.setName(request.getName());
        psychologist.setEmail(request.getEmail());
        psychologist.setPassword(request.getPassword());
        psychologist.setCpf(request.getCpf());

        psychologistRepository.save(psychologist);

        
        request.setStatus(RegistrationStatus.APPROVED);
        requestRepository.save(request);
    }
    
    public void reject(UUID requestId, String reason, User loggedUser) {

    
    if (loggedUser.getTypeUser() != TypeUser.ADMIN) {
        throw new RuntimeException("Apenas ADMIN pode recusar");
    }

    
    PsychologistRegistrationRequest request =
            requestRepository.findById(requestId)
                    .orElseThrow(() -> new RuntimeException("Request não encontrada"));

    
    if (request.getStatus() != RegistrationStatus.PENDING) {
        throw new RuntimeException("Request já foi processada");
    }

    
    if (reason == null || reason.isBlank()) {
        throw new RuntimeException("Motivo da recusa é obrigatório");
    }

    
    request.setStatus(RegistrationStatus.REJECTED);
    request.setRejectionReason(reason);

    requestRepository.save(request);
}
}
