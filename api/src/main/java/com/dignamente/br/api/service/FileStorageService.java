package com.dignamente.br.api.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.dignamente.br.api.dto.File.FileUploadResponseDTO;
import com.dignamente.br.api.exceptions.FileStorageException;

@Service
public class FileStorageService {

    private final Path uploadPath;

    public FileStorageService(@Value("${app.upload-dir:uploads}") String uploadDir) {
        this.uploadPath = Path.of(uploadDir).toAbsolutePath().normalize();
    }

    public FileUploadResponseDTO storeFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new FileStorageException("O arquivo é obrigatório");
        }

        try {
            Files.createDirectories(uploadPath);

            String originalFileName = StringUtils.cleanPath(
                file.getOriginalFilename() == null ? "arquivo" : file.getOriginalFilename()
            );
            String storedFileName = buildStoredFileName(originalFileName);
            Path destination = uploadPath.resolve(storedFileName).normalize();

            if (!destination.startsWith(uploadPath)) {
                throw new FileStorageException("Nome de arquivo inválido");
            }

            Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);

            return new FileUploadResponseDTO(
                originalFileName,
                storedFileName,
                file.getContentType(),
                file.getSize(),
                destination.toString()
            );
        } catch (IOException ex) {
            throw new FileStorageException("Não foi possível salvar o arquivo", ex);
        }
    }

    private String buildStoredFileName(String originalFileName) {
        String extension = "";
        int extensionIndex = originalFileName.lastIndexOf(".");

        if (extensionIndex >= 0) {
            extension = originalFileName.substring(extensionIndex);
        }

        return UUID.randomUUID() + extension;
    }
}
