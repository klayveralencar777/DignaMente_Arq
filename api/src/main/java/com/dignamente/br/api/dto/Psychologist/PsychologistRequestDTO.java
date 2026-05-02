package com.dignamente.br.api.dto.Psychologist;

import java.time.LocalDate;

import com.dignamente.br.api.enums.TypeUser;

public record PsychologistRequestDTO (
    String name,
    String email,
    String cpf,
    TypeUser typeUser,
    String crp,
    String specialty,
    String password,
    LocalDate birthDate


){
    
}
