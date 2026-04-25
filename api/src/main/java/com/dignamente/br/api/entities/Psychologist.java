package com.dignamente.br.api.entities;

import java.time.LocalDate;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;


@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Psychologist extends User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    @NotBlank(message = "O CRP é obrigatório")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private String crp;

    @Column(nullable = false)
    @NotNull(message = "A data de nascimento é obrigatória")
    private LocalDate birthDate;

    
}
