package com.dignamente.br.api.dto.Patient;

import java.time.LocalDate;

import com.dignamente.br.api.enums.TypeUser;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record PatientRequestDTO (

    @NotBlank(message = "O nome é necessário")
    String name,

    @Email(message = "Email deve estar no formato válido")
    String email,

    String cpf,
    String password,
    TypeUser typeUser,
    String cardSus,
    LocalDate birthDate


) {}
