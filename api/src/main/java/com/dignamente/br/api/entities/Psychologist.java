package com.dignamente.br.api.entities;

import java.time.LocalDate;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Psychologist extends User {

    

    @Column(nullable = false, unique = true)
    @NotBlank(message = "O CRP é obrigatório")
    private String crp;

    @Column(nullable = false)
    @NotNull(message = "A data de nascimento é obrigatória")
    private LocalDate birthDate;

    
    @Column(nullable = false)
    @NotNull(message = "A especialidade é obrigatória")
    private String specialty;

    
}
