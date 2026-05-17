package com.dignamente.br.api.dto.Admin;

import java.time.LocalDate;

import com.dignamente.br.api.enums.TypeUser;

public record AdminRequestDTO (
    String name,
    String email,
    String password,
    String cpf,
    String registration,
    TypeUser typeUser,
    LocalDate birthDate
){}
