package com.dignamente.br.api.dto.Login;

import java.util.UUID;

import com.dignamente.br.api.enums.TypeUser;

public record LoginResponseDTO(
    UUID id,
    TypeUser typeUser,
    String token,
    String name, // ADICIONADO O NOME AQUI!
    String crp
) {}