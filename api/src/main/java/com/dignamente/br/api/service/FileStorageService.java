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



@Service
public class FileStorageService {

  private final Path uploadPath;

    public FileStorageService(@Value("${app.upload-dir:uploads}") String uploadDir) {
        this.uploadPath = Path.of(uploadDir).toAbsolutePath().normalize();
    }

    public String storeFile(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new RuntimeException("Arquivo obrigatório");
        }

        try {
            Files.createDirectories(uploadPath);

            String originalFileName = StringUtils.cleanPath(
                file.getOriginalFilename() == null ? "arquivo" : file.getOriginalFilename()
            );

            String extension = "";
            int index = originalFileName.lastIndexOf(".");
            if (index >= 0) {
                extension = originalFileName.substring(index);
            }

            String storedFileName = UUID.randomUUID() + extension;

            Path destination = uploadPath.resolve(storedFileName).normalize();

            if (!destination.startsWith(uploadPath)) {
                throw new RuntimeException("Arquivo inválido");
            }

            Files.copy(
                file.getInputStream(),
                destination,
                StandardCopyOption.REPLACE_EXISTING
            );

            return storedFileName;

        } catch (IOException e) {
            throw new RuntimeException("Erro ao salvar arquivo", e);
        }
    }
}
