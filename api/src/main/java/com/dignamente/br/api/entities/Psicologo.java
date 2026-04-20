package com.dignamente.br.api.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.time.LocalDate;

@Entity
@Table(name = "tb_psicologo") // Isso define o nome da tabela no banco de dados
public class Psicologo extends Usuario {

    private String crp;
    private LocalDate dataNascimento;

    // Construtor padrão
    public Psicologo() {
    }

    // Getters e Setters
    public String getCrp() {
        return crp;
    }

    public void setCrp(String crp) {
        this.crp = crp;
    }

    public LocalDate getDataNascimento() {
        return dataNascimento;
    }

    public void setDataNascimento(LocalDate dataNascimento) {
        this.dataNascimento = dataNascimento;
    }
}