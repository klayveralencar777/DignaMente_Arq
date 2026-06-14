package com.dignamente.br.api.dto.Admin;

import java.time.LocalDateTime;
import java.util.UUID;

import com.dignamente.br.api.enums.TypeUser;

public record AdminResponseDTO (
    UUID id,
    String name,
    String email,
    String cpf,
    TypeUser typeUser,
    String registration,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
){
 
}
