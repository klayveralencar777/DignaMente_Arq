package com.dignamente.br.api.dto.File;

public record FileUploadResponseDTO(
    String originalFileName,
    String storedFileName,
    String contentType,
    long size,
    String path
) {
}
