package com.dignamente.br.api.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dignamente.br.api.entities.PsychologistRegistrationRequest;




public interface PsychologistRegistrationRepository extends JpaRepository<PsychologistRegistrationRequest, UUID>{
    
}
