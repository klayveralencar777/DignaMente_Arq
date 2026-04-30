package com.dignamente.br.api.dto.User;

public record CreateAdminDTO(
        String name,
        String email,
        String password,
        String cpf
) {
}
