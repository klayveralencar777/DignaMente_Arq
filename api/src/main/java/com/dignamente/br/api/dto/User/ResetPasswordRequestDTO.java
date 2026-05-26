package com.dignamente.br.api.dto.User;

public record  ResetPasswordRequestDTO(
    String token,
    String newPassword
) {
    
}
