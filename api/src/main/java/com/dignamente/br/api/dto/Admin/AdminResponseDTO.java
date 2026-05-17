package com.dignamente.br.api.dto.Admin;

import java.time.LocalDate;

import com.dignamente.br.api.enums.TypeUser;

public record AdminResponseDTO (
    String name,
    String email,
    String cpf,
    TypeUser typeUser,
    LocalDate birthDate
){
 
}
