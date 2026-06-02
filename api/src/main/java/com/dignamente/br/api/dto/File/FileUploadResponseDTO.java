package com.dignamente.br.api.dto.File;

import java.time.LocalDateTime;
import java.util.UUID;

public record FileUploadResponseDTO(
        UUID id,
        UUID medicalRecordId,
        String fileName,
        String originalFileName,
        String contentType,
        long size,
        LocalDateTime createdAt) {
}
