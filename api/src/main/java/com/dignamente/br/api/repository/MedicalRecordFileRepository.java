package com.dignamente.br.api.repository;

import com.dignamente.br.api.entities.MedicalRecordFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MedicalRecordFileRepository extends JpaRepository<MedicalRecordFile, UUID> {

    List<MedicalRecordFile> findByMedicalRecordId(UUID medicalRecordId);
}
