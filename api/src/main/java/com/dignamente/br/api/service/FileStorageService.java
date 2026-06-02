package com.dignamente.br.api.service;

import com.dignamente.br.api.dto.File.FileUploadResponseDTO;
import com.dignamente.br.api.entities.MedicalRecord;
import com.dignamente.br.api.entities.MedicalRecordFile;
import com.dignamente.br.api.entities.User;
import com.dignamente.br.api.enums.TypeUser;
import com.dignamente.br.api.exceptions.EntityNotFoundException;
import com.dignamente.br.api.repository.MedicalRecordFileRepository;
import com.dignamente.br.api.repository.MedicalRecordRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
public class FileStorageService {

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024;
    private static final List<String> ALLOWED_CONTENT_TYPES = List.of(
            "application/pdf",
            "image/png",
            "image/jpeg");

    private final Path uploadPath = Paths.get("uploads").toAbsolutePath().normalize();

    private final MedicalRecordRepository medicalRecordRepository;
    private final MedicalRecordFileRepository medicalRecordFileRepository;

    public FileStorageService(
            MedicalRecordRepository medicalRecordRepository,
            MedicalRecordFileRepository medicalRecordFileRepository) {
        this.medicalRecordRepository = medicalRecordRepository;
        this.medicalRecordFileRepository = medicalRecordFileRepository;
    }

    public FileUploadResponseDTO uploadToMedicalRecord(UUID medicalRecordId, MultipartFile file, User loggedUser) {
        checkUser(loggedUser);
        validateFile(file);

        MedicalRecord medicalRecord = medicalRecordRepository.findById(medicalRecordId)
                .orElseThrow(() -> new EntityNotFoundException("Prontuário não encontrado."));

        checkAccess(medicalRecord, loggedUser);

        try {
            Files.createDirectories(uploadPath);

            String originalFileName = file.getOriginalFilename() == null
                    ? ""
                    : StringUtils.cleanPath(file.getOriginalFilename());
            String extension = getExtension(originalFileName);
            String fileName = UUID.randomUUID() + extension;
            Path destination = uploadPath.resolve(fileName).normalize();

            Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);

            MedicalRecordFile medicalRecordFile = new MedicalRecordFile();
            medicalRecordFile.setMedicalRecord(medicalRecord);
            medicalRecordFile.setFileName(fileName);
            medicalRecordFile.setOriginalFileName(originalFileName);
            medicalRecordFile.setContentType(file.getContentType());
            medicalRecordFile.setSize(file.getSize());
            medicalRecordFile.setPath(destination.toString());

            return toDto(medicalRecordFileRepository.save(medicalRecordFile));
        } catch (IOException ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao salvar arquivo.");
        }
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Arquivo é obrigatório.");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new ResponseStatusException(HttpStatus.PAYLOAD_TOO_LARGE, "Arquivo deve ter no máximo 5MB.");
        }

        String contentType = file.getContentType();
        if (!ALLOWED_CONTENT_TYPES.contains(contentType)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Tipo de arquivo inválido. Envie apenas PDF, PNG, JPG ou JPEG.");
        }
    }

    private String getExtension(String fileName) {
        if (!StringUtils.hasText(fileName)) {
            return "";
        }

        int dotIndex = fileName.lastIndexOf(".");
        if (dotIndex == -1) {
            return "";
        }

        return fileName.substring(dotIndex);
    }

    private void checkUser(User user) {
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário não autenticado!");
        }
    }

    private void checkAccess(MedicalRecord medicalRecord, User loggedUser) {
        boolean isPatientOwner = loggedUser.getTypeUser() == TypeUser.PATIENT
                && medicalRecord.getPatient().getId().equals(loggedUser.getId());

        boolean isPsychologistOwner = loggedUser.getTypeUser() == TypeUser.PSYCHOLOGIST
                && medicalRecord.getPsychologist().getId().equals(loggedUser.getId());

        if (!isPatientOwner && !isPsychologistOwner) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Você não tem acesso a este prontuário.");
        }
    }

    private FileUploadResponseDTO toDto(MedicalRecordFile file) {
        return new FileUploadResponseDTO(
                file.getId(),
                file.getMedicalRecord().getId(),
                file.getFileName(),
                file.getOriginalFileName(),
                file.getContentType(),
                file.getSize(),
                file.getCreatedAt());
    }
}
