package com.dignamente.br.api.dto.PsychologistRequestRegistration;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RegistrationRequestDTO (

    @NotBlank(message = "O nome é obrigatório")
    String name,

    @NotBlank(message = "O email é obrigatório")
    @Email(message = "Email inválido")
    String email,

    @NotBlank(message = "A senha é obrigatória")
    String password,

    @NotBlank(message = "O CPF é obrigatório")
    String cpf,

    @NotNull(message = "O diploma é obrigatório")
    MultipartFile diploma,

    @NotNull(message = "O documento do CRP é obrigatório")
    MultipartFile crpDocument
    
) {
    
}
