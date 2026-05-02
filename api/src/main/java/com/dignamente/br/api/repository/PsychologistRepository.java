package com.dignamente.br.api.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dignamente.br.api.entities.Psychologist;

@Repository
public interface PsychologistRepository extends JpaRepository<Psychologist, UUID>{
    boolean existsByEmail(String email);

    boolean existsByCpf(String cpf);

    
}
