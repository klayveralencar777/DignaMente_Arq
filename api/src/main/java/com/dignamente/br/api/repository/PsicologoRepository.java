package com.dignamente.br.api.repository;

import com.dignamente.br.api.entities.Psicologo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PsicologoRepository extends JpaRepository<Psicologo, Long> {
    // O Spring Boot vai preencher as funções de Salvar, Deletar e Buscar automaticamente aqui.
}