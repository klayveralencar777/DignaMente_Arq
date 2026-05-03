package com.dignamente.br.api.dto.Patient;

import java.time.LocalDate;

import com.dignamente.br.api.enums.TypeUser;



public record PatientRequestDTO (

   
    String name,

    String email,

    String cpf,
    String password,
    TypeUser typeUser,
    String cardSus,
    LocalDate birthDate


) {}
