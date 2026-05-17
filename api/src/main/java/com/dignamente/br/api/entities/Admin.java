package com.dignamente.br.api.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@Setter
@Getter
@AllArgsConstructor
public class Admin extends User{

    @Column(nullable = false)
    @NotBlank(message = "A matrícula é necessária")
    private String registration;
    
}
